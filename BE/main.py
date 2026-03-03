import os
import cv2
import numpy as np
import json
import re
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
app = FastAPI()

GROQ_API_KEY = os.getenv("SECRET_GROQ_API")
client = Groq(api_key=GROQ_API_KEY)
MODEL_ID = "llama-3.3-70b-versatile"
# MODEL_ID = "llama-3.1-8b-instant"

model = YOLO("model/best.pt")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect-ingredients")
async def detect_ingredients(file: UploadFile = File(...), data: str = Form(...)):
    meal_time = None
    diet_modes = []
    allergens = []
    # Xử lý data các tuỳ chọn
    if data:
        try:
            parsed_data = json.loads(data)
            meal_time = parsed_data.get("mealTime")
            diet_modes = parsed_data.get("dietModes", [])
            allergens = parsed_data.get("allergens", [])
        except json.JSONDecodeError:
            return {"error": "Dữ liệu JSON không hợp lệ"}
        
    # Xử lý hình ảnh
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
    # Nhận diện nguyên liệu
    results = model(img, conf=0.5)
    detected_map = {}
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf_val = float(box.conf[0])
            name = model.names[cls_id]
            if name not in detected_map or conf_val > detected_map[name]:
                detected_map[name] = conf_val
    details = [
        {"name": name, "confidence": round(conf * 100, 2)} 
        for name, conf in detected_map.items()
    ]
    list_detected = list(detected_map.keys())
    suggestions = []

    if list_detected:
        prompt_parts = [f"Dựa trên các nguyên liệu chính: {', '.join(list_detected)}."]
        
        # Thêm điều kiện nếu có Meal Time
        if meal_time:
            prompt_parts.append(f"- Món ăn phù hợp cho buổi: {meal_time}.")
            
        # Thêm điều kiện nếu có Diet Modes
        if diet_modes:
            prompt_parts.append(f"- BẮT BUỘC tuân thủ chế độ ăn: {', '.join(diet_modes)}.")
            
        # Thêm điều kiện nếu có Allergens (Dị ứng)
        if allergens:
            # Allergens đang là list object [{"name": "Sữa", "severity": "Nhẹ"}], ta lấy ra tên
            allergen_names = [a.get("name") for a in allergens if isinstance(a, dict) and "name" in a]
            if allergen_names:
                prompt_parts.append(f"- TUYỆT ĐỐI KHÔNG SỬ DỤNG các nguyên liệu gây dị ứng sau: {', '.join(allergen_names)}.")
                
        # Nối mẫu JSON vào cuối Prompt
        prompt_parts.append("""
        Hãy tìm tối thiểu 2, tối đa 20 công thức nấu ăn (tên món ăn là tiếng việt) có thật, bao gồm các nguyên liệu trên. 
        Kết quả bắt buộc trả về định dạng JSON có chứa key "recipes" chứa mảng các món ăn theo mẫu sau:
        {
            "recipes": [
                {
                    "name": "Tên món ăn",
                    "reason": "Giải thích ngắn gọn lý do vì sao phù hợp với chế độ ăn/nguyên liệu này",
                    "cookingTime": 15,
                    "ingredients": ["100g thịt...", "1 củ..."],
                    "instructions": ["Bước 1...", "Bước 2..."],
                    "nutrition": { "protein": 20, "carbs": 10, "fat": 5 },
                }
            ]
        }
        Lưu ý: Không viết lời dẫn, chỉ trả về duy nhất chuỗi JSON.
        """)
        
        # Gộp tất cả lại thành 1 chuỗi prompt hoàn chỉnh
        final_prompt = "\n".join(prompt_parts)
        
        try:
            # Gọi Groq API
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Bạn là một đầu bếp và chuyên gia dinh dưỡng hàng đầu. Bạn CHỈ trả lời bằng định dạng JSON thuần túy (JSON object). KHÔNG dùng markdown (không có ```json). KHÔNG giải thích. Đảm bảo ngoặc đóng mở chuẩn xác. Không tạo dữ liệu ảo, không tìm được món phù hợp thì báo không tìm được."
                    },
                    {
                        "role": "user",
                        "content": final_prompt,
                    }
                ],
                model=MODEL_ID,
                response_format={"type": "json_object"}
            )
            
            # Parse kết quả
            res_content = chat_completion.choices[0].message.content
            # Ép kiểu an toàn từ AI trả về
            res_data = json.loads(res_content)
            
            # Lấy mảng recipes từ JSON Object
            if isinstance(res_data, dict) and "recipes" in res_data:
                suggestions = res_data["recipes"]
            elif isinstance(res_data, list): 
                # Trường hợp hiếm hoi AI vẫn cố tình trả về list dù đã ép json_object
                suggestions = res_data
            else:
                suggestions = [res_data]
                
        except Exception as e:
            print(f"Lỗi xử lý AI: {e}")
            suggestions = [{
                "id": "error",
                "name": "Không thể tải công thức lúc này",
                "reason": "Lỗi kết nối với AI Server",
                "image": "[https://images.unsplash.com/photo-1512058560366-cd242d4235cd](https://images.unsplash.com/photo-1512058560366-cd242d4235cd)",
                "cookingTime": 0,
                "ingredients": list_detected,
                "instructions": ["Vui lòng thử lại sau."],
                "nutrition": { "protein": 0, "carbs": 0, "fat": 0 },
                "servings": 0
            }]

    return {
        "ingredients": list_detected,
        "suggestions": suggestions,
        "details": details
    }