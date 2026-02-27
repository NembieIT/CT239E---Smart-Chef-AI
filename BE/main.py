import os
import cv2
import numpy as np
import json
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
app = FastAPI()

GROQ_API_KEY = os.getenv("SECRET_GROQ_API")
client = Groq(api_key=GROQ_API_KEY)
# MODEL_ID = "llama-3.3-70b-versatile"
MODEL_ID = "llama-3.1-8b-instant"

model = YOLO("model/best.pt")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect-ingredients")
async def detect_ingredients(file: UploadFile = File(...)):
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
        prompt = f"""
        Dựa trên nguyên liệu: {', '.join(list_detected)}.
        Hãy tìm tối thiểu 2, tối đa 20 công thức nấu ăn (tên món ăn là tiếng việt) có thật bắt buộc bao gồm các nguyên liệu (tên nguyên liệu dịch sang tiếng việt) trên và trả về kết quả dạng json dựa theo mẫu bên dưới:
        "{{
            "id": "50",
            "name": "Tên món ăn",
            "image": "https://img.freepik.com/free-photo/top-view-table-full-food_23-2149209253.jpg?semt=ais_user_personalization&w=740&q=80",
            "cookingTime": 15,
            "ingredients": ["100g thịt...", "1 củ..."],
            "instructions": ["Bước 1...", "Bước 2..."],
            "nutrition": {{ "protein": 20, "carbs": 10, "fat": 5 }},
            "servings": 2
        }}"
        Lưu ý: Không viết lời dẫn, chỉ trả về JSON.
        """
        
        try:
            # Gọi Groq API
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Bạn là một đầu bếp chuyên gia. Bạn chỉ trả lời bằng định dạng JSON thuần túy. QUY TẮC BẮT BUỘC: 1. TRẢ VỀ DUY NHẤT MỘT MẢNG JSON (ARRAY). 2. KHÔNG bọc trong các key như 'recipes' hay 'suggestions'. 3. KHÔNG viết lời dẫn, không dùng Markdown (không có ```json). 4. Phải đảm bảo các dấu ngoặc đóng/mở chính xác. 5. Các món ăn bắt buộc là món với thành phần chính là nguyên liệu tôi gửi lên."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=MODEL_ID,
                # Ép kiểu trả về JSON
                response_format={"type": "json_object"}
            )
            # Parse kết quả
            res_content = chat_completion.choices[0].message.content
            data = json.loads(res_content)
            
            # Groq thường trả về Object, chúng ta cần lấy mảng công thức
            # Nếu AI trả về {"recipes": [...]}, ta lấy mảng bên trong
            if isinstance(data, dict) and "recipes" in data:
                suggestions = data["recipes"]
            elif isinstance(data, list):
                suggestions = data
            else:
                suggestions = [data]
        except Exception as e:
            # Dữ liệu dự phòng nếu AI vẫn lỗi
            print(f"Lỗi xử lý Groq: {e}")
            suggestions = [{
                "id": "error",
                "name": "Không thể tải công thức",
                "image": "https://images.unsplash.com/photo-1512058560366-cd242d4235cd",
                "cookingTime": 0,
                "ingredients": list_detected,
                "instructions": ["Lỗi kết nối AI, vui lòng thử lại sau."],
                "nutrition": { "protein": 0, "carbs": 0, "fat": 0 },
                "servings": 0
            }]

    return {
        "ingredients": list_detected,
        "suggestions": suggestions,
        "details": details
    }