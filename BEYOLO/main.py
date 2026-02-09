from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()
model = YOLO("runs/detect/train/weights/best.pt")

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
    
    results = model(img, conf=0.002)

    print("Number of results:", len(results))
    ingredients = set()
    
    for r in results:
        for c in r.boxes.cls:
            class_name = model.names[int(c)]
            ingredients.add(class_name)
    
    for r in results:
        if r.boxes is None:
            print("No boxes")
            continue

    for cls, conf in zip(r.boxes.cls, r.boxes.conf):
        class_name = model.names[int(cls)]
        print(f"{class_name}: {conf.item():.4f}")
    print("Final ingredients:", list(ingredients))
    return {
        "ingredients": list(ingredients)
    }