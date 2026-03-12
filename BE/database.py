import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Khởi tạo MongoDB Client
db_client = AsyncIOMotorClient(MONGO_URI)
db = db_client.smart_chef_db

# Xuất các collection để các file khác sử dụng
users_collection = db.users
history_collection = db.history