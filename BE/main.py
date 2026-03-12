from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import các router
from routers import auth, detect, recipe

app = FastAPI(title="Smart Chef AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nhúng các API từ thư mục routers vào app chính
app.include_router(auth.router)
app.include_router(detect.router)
app.include_router(recipe.router)