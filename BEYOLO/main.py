from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

# Tải mô hình YOLOv8 của bạn
model = YOLO("runs/detect/train/weights/best.pt")

# Cấu hình CORS bắt buộc để kết nối với React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect-ingredients")
async def detect_ingredients(file: UploadFile = File(...)):
    contents = await file.read()
    
    # Chuyển đổi dữ liệu byte sang định dạng ảnh OpenCV
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
  
    results = model(img, conf=0.0002)

    ingredients = set()
    details = []
    
    for r in results:
        if r.boxes:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf_val = float(box.conf[0])
                class_name = model.names[cls_id]
                
                ingredients.add(class_name)
                # Trả về cả tên và độ tin cậy để React hiển thị
                details.append({
                    "name": class_name,
                    "confidence": conf_val * 100 
                })
    
    return {
        "ingredients": list(ingredients),
        "details": details
    }