from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from database import users_collection
from security import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user

# Tạo router với tiền tố /auth
router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    hashed_password = get_password_hash(user.password)
    
    user_dict = {
        "username": user.username, 
        "password": hashed_password,
        "diet_modes": [], 
        "allergens": []
    }
    
    await users_collection.insert_one(user_dict)
    return {"message": "Đăng ký thành công"}

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không đúng",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from typing import List

# Tạo khuôn dữ liệu cho Preferences
class UserPreferences(BaseModel):
    diet_modes: List[str]
    allergens: List[str]

# API lấy thông tin người dùng hiện tại
@router.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return {
        "username": current_user["username"],
        "diet_modes": current_user.get("diet_modes", []),
        "allergens": current_user.get("allergens", [])
    }

# API cập nhật chế độ ăn và dị ứng
@router.put("/me/preferences")
async def update_my_preferences(prefs: UserPreferences, current_user: dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"username": current_user["username"]},
        {"$set": {
            "diet_modes": prefs.diet_modes, 
            "allergens": prefs.allergens
        }}
    )
    return {"message": "Cập nhật thiết lập thành công!"}