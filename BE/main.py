from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from dotenv import load_dotenv
import cv2
import numpy as np
import google.generativeai as genai
import json
import re
import os

app = FastAPI()
load_dotenv()
# --- 1. CẤU HÌNH GEMINI (SỬA LỖI 404) ---
GOOGLE_API_KEY = os.getenv("SERECT_GOOGLE_API")
genai.configure(api_key=GOOGLE_API_KEY)

# Sử dụng 'gemini-pro' thay vì flash để tránh lỗi 404 ở một số khu vực
gemini_model = genai.GenerativeModel('gemini-pro')

# --- 2. TẢI MÔ HÌNH YOLO ---
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
    
    # Nhận diện nguyên liệu (YOLO vẫn đang chạy rất tốt: 73.8ms)
    results = model(img, conf=0.25)
    detected = set()
    for r in results:
        for box in r.boxes:
            detected.add(model.names[int(box.cls[0])])
    
    list_detected = list(detected)
    suggestions = []

    if list_detected:
        # Prompt ép kiểu dữ liệu chính xác như bạn yêu cầu
        prompt = f"""
        Dựa trên nguyên liệu: {', '.join(list_detected)}.
        Hãy gợi ý 1 món ăn Việt Nam phù hợp. 
        Trả về kết quả duy nhất dưới dạng JSON thuần túy theo cấu trúc này:
        {{
            "id": "50",
            "name": "Tên món ăn",
            "image": "https://images.unsplash.com/photo-1512058560366-cd242d4235cd?q=80&w=1080",
            "cookingTime": 15,
            "ingredients": ["100g thịt...", "1 củ..."],
            "instructions": ["Bước 1...", "Bước 2..."],
            "nutrition": {{ "protein": 20, "carbs": 10, "fat": 5 }},
            "servings": 2
        }}
        Lưu ý: Không viết lời dẫn, chỉ trả về JSON.
        """
        
        try:
            # Gọi Gemini Pro
            response = gemini_model.generate_content(prompt)
            
            # Làm sạch chuỗi trả về (đề phòng Markdown)
            json_text = response.text
            if "```json" in json_text:
                json_text = json_text.split("```json")[1].split("```")[0]
            elif "```" in json_text:
                json_text = json_text.split("```")[1].split("```")[0]
            
            # Chuyển thành object
            recipe_obj = json.loads(json_text.strip())
            suggestions = [recipe_obj] # Bọc trong mảng để React map dễ dàng
            
        except Exception as e:
            print(f"Lỗi xử lý Gemini: {e}")
            # Dữ liệu dự phòng nếu AI vẫn lỗi
            suggestions = [{
                "id": "error",
                "name": "Gà xào hành tây ớt chuông",
                "image": "https://images.unsplash.com/photo-1512058560366-cd242d4235cd",
                "cookingTime": 20,
                "ingredients": list_detected,
                "instructions": ["Sơ chế nguyên liệu", "Xào gà chín tái", "Cho rau củ vào đảo đều"],
                "nutrition": { "protein": 25, "carbs": 5, "fat": 10 },
                "servings": 2
            }]

    return {
        "ingredients": list_detected,
        "suggestions": suggestions
    }