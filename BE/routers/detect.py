import os
import cv2
import numpy as np
import json
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from ultralytics import YOLO
from groq import Groq
from database import history_collection
from security import get_current_user
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["Detection & History"])

GROQ_API_KEY = os.getenv("SECRET_GROQ_API")
client = Groq(api_key=GROQ_API_KEY)
MODEL_ID = "llama-3.3-70b-versatile"
# MODEL_ID = "llama-3.1-8b-instant"
model = YOLO("model/best.pt")

class SaveHistoryRequest(BaseModel):
    input_data: Dict[str, Any]
    detected_ingredients: List[str]
    selected_recipe: Dict[str, Any]

@router.post("/detect-ingredients")
async def detect_ingredients(
    file: UploadFile = File(...), 
    data: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    meal_time = None
    diet_modes = []
    allergens = []
    
    if data:
        try:
            parsed_data = json.loads(data)
            meal_time = parsed_data.get("mealTime")
            diet_modes = parsed_data.get("dietModes", [])
            allergens = parsed_data.get("allergens", [])
        except json.JSONDecodeError:
            return {"error": "Dữ liệu JSON không hợp lệ"}
        
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
    results = model(img, conf=0.5)
    detected_map = {}
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf_val = float(box.conf[0])
            name = model.names[cls_id]
            if name not in detected_map or conf_val > detected_map[name]:
                detected_map[name] = conf_val
                
    details = [{"name": name, "confidence": round(conf * 100, 2)} for name, conf in detected_map.items()]
    list_detected = list(detected_map.keys())
    suggestions = []

    if list_detected:
        allergen_names = []
        for a in allergens:
            if isinstance(a, str): allergen_names.append(a)
            elif isinstance(a, dict) and "name" in a: allergen_names.append(a.get("name"))

        # XÂY DỰNG PROMPT VỚI ĐIỀU KIỆN KIỂM TRA CHẶT CHẼ
        prompt_parts = [
            "BẠN LÀ MỘT BẾP TRƯỞNG CHUYÊN NGHIỆP.",
            f"Nguyên liệu nhận diện được (Tiếng Anh/Việt): {', '.join(list_detected)}.",
            f"Buổi ăn: {meal_time if meal_time else 'Không xác định'}.",
            f"Chế độ ăn: {', '.join(diet_modes) if diet_modes else 'Bình thường'}.",
            f"Danh sách dị ứng TUYỆT ĐỐI KHÔNG DÙNG: {', '.join(allergen_names) if allergen_names else 'Không có'}."
        ]

        prompt_parts.append("""
        NHIỆM VỤ:
        1. Dịch nguyên liệu nhận diện sang tiếng Việt.
        2. Kiểm tra: Nếu nguyên liệu nhận diện nằm trong danh sách DỊ ỨNG, hoặc không thể kết hợp để nấu thành bất kỳ món ăn Việt Nam có thật nào, hãy trả về kết quả là mảng 'recipes' rỗng [].
        3. KHÔNG ĐƯỢC tự bịa ra nguyên liệu không có trong ảnh để cố nấu món khác.
        4. KHÔNG ĐƯỢC trả về dữ liệu ảo nếu không tìm thấy món phù hợp.

        ĐỊNH DẠNG TRẢ VỀ JSON DUY NHẤT:
        {
            "recipes": [
                {
                    "name": "Tên món (Tiếng Việt)", 
                    "reason": "Giải thích logic sự phù hợp", 
                    "cookingTime": 30,
                    "servings": 2,
                    "ingredients": ["định lượng + tên"], 
                    "instructions": ["Bước 1", "Bước 2"],
                    "nutrition": { "protein": 20, "carbs": 10, "fat": 5 }
                }
            ]
        }
        Lưu ý: Nếu không có món phù hợp, trả về {"recipes": []}.
        """)
        
        final_prompt = "\n".join(prompt_parts)

        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "Bạn là đầu bếp trung thực. Nếu không thể nấu món từ nguyên liệu được cho hoặc vi phạm dị ứng, trả về mảng recipes rỗng. Tuyệt đối không bịa đặt."},
                    {"role": "user", "content": final_prompt}
                ],
                model=MODEL_ID, 
                response_format={"type": "json_object"},
                temperature=0.1 # Giảm xuống mức cực thấp để AI bớt "sáng tạo" lung tung
            )
            res_content = chat_completion.choices[0].message.content
            res_data = json.loads(res_content)
            
            # Lấy danh sách recipes
            suggestions = res_data.get("recipes", [])

            # Nếu AI trả về mảng rỗng, ta có thể gửi thông báo cụ thể cho User
            if len(suggestions) == 0:
                suggestions = [{
                    "name": "Không tìm thấy món phù hợp",
                    "reason": "Nguyên liệu bị xung đột với danh sách dị ứng hoặc không đủ để tạo thành món ăn.",
                    "cookingTime": 0,
                    "servings": 0,
                    "ingredients": [],
                    "instructions": ["Vui lòng thử lại với nguyên liệu khác hoặc kiểm tra lại danh sách dị ứng của bạn."],
                    "nutrition": {"protein": 0, "carbs": 0, "fat": 0}
                }]

        except Exception as e:
            print(f"Lỗi AI: {e}")
            suggestions = [{
                "name": "Lỗi xử lý AI", 
                "reason": "Không thể kết nối với trí tuệ nhân tạo lúc này.",
                "cookingTime": 0, "servings": 0,
                "ingredients": list_detected, 
                "instructions": ["Vui lòng thử lại sau vài phút."],
                "nutrition": { "protein": 0, "carbs": 0, "fat": 0 }
            }]
            
    return {"ingredients": list_detected, "suggestions": suggestions, "details": details}

@router.post("/save-history")
async def save_history(
    request: SaveHistoryRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id_str = str(current_user["_id"])
    history_record = {
        "user_id": user_id_str,
        "username": current_user["username"],
        "timestamp": datetime.utcnow(),
        "input_data": request.input_data,
        "detected_ingredients": request.detected_ingredients,
        "details": [], 
        "suggestions": [request.selected_recipe]
    }
    await history_collection.insert_one(history_record)
    
    # Logic giới hạn 30 bản ghi cho mỗi User
    cursor = history_collection.find({"user_id": user_id_str}).sort("timestamp", -1)
    all_history = await cursor.to_list(length=100)
    if len(all_history) > 30:
        last_allowed_timestamp = all_history[29]["timestamp"]
        await history_collection.delete_many({
            "user_id": user_id_str,
            "timestamp": {"$lt": last_allowed_timestamp}
        })
    return {"message": "Đã lưu lịch sử thành công."}

@router.get("/my-history")
async def get_my_history(current_user: dict = Depends(get_current_user)):
    cursor = history_collection.find({"user_id": str(current_user["_id"])}).sort("timestamp", -1)
    history_list = await cursor.to_list(length=30) 
    for item in history_list:
        item["_id"] = str(item["_id"])
    return {"history": history_list}