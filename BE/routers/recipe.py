import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Tạo một "nhánh" router riêng cho tính năng Recipe
router = APIRouter(prefix="/recipe", tags=["Recipe Generator"])

# Khởi tạo kết nối với AI Groq
GROQ_API_KEY = os.getenv("SECRET_GROQ_API")
client = Groq(api_key=GROQ_API_KEY)
MODEL_ID = "llama-3.3-70b-versatile"

# 1. Tạo "Cái khuôn" (Model) để quy định dữ liệu Frontend gửi lên phải có hình dáng thế nào
class RecipeRequest(BaseModel):
    ingredients: List[str]      # Danh sách nguyên liệu người dùng nhập
    dietModes: List[str] = []   # Chế độ ăn (không bắt buộc)
    allergens: List[str] = []   # Dị ứng (không bắt buộc)

# 2. Tạo đường dẫn (API Endpoint) để Frontend gọi vào
@router.post("/generate")
async def generate_recipes(request: RecipeRequest):
    # Kiểm tra xem người dùng có nhập nguyên liệu chưa
    if not request.ingredients:
        raise HTTPException(status_code=400, detail="Vui lòng nhập ít nhất 1 nguyên liệu.")

    # 3. Lắp ráp câu lệnh (Prompt) để ra lệnh cho AI
    prompt_parts = [f"Dựa trên các nguyên liệu sau: {', '.join(request.ingredients)}."]
    
    if request.dietModes:
        prompt_parts.append(f"- BẮT BUỘC tuân thủ chế độ ăn: {', '.join(request.dietModes)}.")
    
    if request.allergens:
        prompt_parts.append(f"- TUYỆT ĐỐI KHÔNG SỬ DỤNG nguyên liệu gây dị ứng: {', '.join(request.allergens)}.")
        
    prompt_parts.append("""
    Hãy nghĩ ra từ 3 đến 6 công thức nấu ăn (tên tiếng Việt) sử dụng các nguyên liệu trên.
    Kết quả BẮT BUỘC là 1 chuỗi JSON theo mẫu sau:
    {
        "recipes": [
            {
                "name": "Tên món",
                "reason": "Lý do phù hợp",
                "cookingTime": 20,
                "ingredients": ["Nguyên liệu 1", "Nguyên liệu 2"],
                "instructions": ["Bước 1", "Bước 2"],
                "nutrition": { "protein": 10, "carbs": 20, "fat": 5 }
            }
        ]
    }
    Lưu ý: CHỈ TRẢ VỀ JSON, KHÔNG GIẢI THÍCH GÌ THÊM.
    """)
    
    final_prompt = "\n".join(prompt_parts)
    
    # 4. Gửi yêu cầu sang Groq AI và chờ kết quả
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Bạn là đầu bếp AI xuất sắc. Chỉ trả lời bằng định dạng JSON thuần túy."
                },
                {
                    "role": "user",
                    "content": final_prompt,
                }
            ],
            model=MODEL_ID,
            response_format={"type": "json_object"} # Ép AI trả về JSON
        )
        
        # 5. Dịch kết quả từ AI sang dạng Dictionary của Python
        res_content = chat_completion.choices[0].message.content
        res_data = json.loads(res_content)
        
        # Trả về kết quả cho Frontend
        if isinstance(res_data, dict) and "recipes" in res_data:
            return {"suggestions": res_data["recipes"]}
        else:
            return {"suggestions": []}
            
    except Exception as e:
        print(f"Lỗi AI: {e}")
        raise HTTPException(status_code=500, detail="Lỗi kết nối AI Server. Vui lòng thử lại sau.")
    
    
class SearchRequest(BaseModel):
    query: str

@router.post("/search")
async def search_recipe(request: SearchRequest):
    # Đổi câu thông báo lỗi cho hợp với ngữ cảnh mới
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Vui lòng nhập miêu tả món ăn bạn muốn tìm.")

    # ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT: Mình đã viết lại Prompt để AI hiểu nó là người tư vấn
    prompt = f"""
    Người dùng đang tìm kiếm một món ăn với yêu cầu hoặc miêu tả như sau: "{request.query}". 
    
    Bạn là một siêu đầu bếp AI. Hãy suy nghĩ, phân tích yêu cầu trên và chọn ra 1 món ăn phù hợp nhất (có thật) để giới thiệu cho họ. Cung cấp công thức chuẩn nhất cho món này (bằng tiếng Việt).
    
    Kết quả BẮT BUỘC là 1 chuỗi JSON theo mẫu sau (Lưu ý trả về mảng 'recipes' có 1 phần tử để đồng bộ với các API khác):
    {{
        "recipes": [
            {{
                "name": "Tên món ăn hoàn chỉnh",
                "reason": "Giải thích ngắn gọn tại sao món ăn này lại cực kỳ phù hợp với yêu cầu của người dùng",
                "cookingTime": 30,
                "ingredients": ["Nguyên liệu 1", "Nguyên liệu 2"],
                "instructions": ["Bước 1...", "Bước 2..."],
                "nutrition": {{ "protein": 15, "carbs": 40, "fat": 10 }}
            }}
        ]
    }}
    Lưu ý: CHỈ TRẢ VỀ JSON THUẦN TÚY. KHÔNG VIẾT LỜI DẪN hay bất kỳ định dạng nào khác.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Bạn là đầu bếp AI xuất sắc. Chỉ trả lời bằng định dạng JSON thuần túy."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL_ID,
            response_format={"type": "json_object"}
        )
        
        res_content = chat_completion.choices[0].message.content
        res_data = json.loads(res_content)
        
        if isinstance(res_data, dict) and "recipes" in res_data:
            return {"suggestions": res_data["recipes"]}
        else:
            return {"suggestions": []}
            
    except Exception as e:
        print(f"Lỗi AI: {e}")
        raise HTTPException(status_code=500, detail="Lỗi kết nối AI Server.")
    


from routers.auth import get_current_user
from fastapi import Depends
from database import db

meal_plans_collection = db.meal_plans

@router.get("/weekly-plan")
async def get_saved_weekly_plan(current_user: dict = Depends(get_current_user)):
    # Tìm xem user này đã có lộ trình trong DB chưa
    plan_doc = await meal_plans_collection.find_one({"username": current_user["username"]})
    
    if plan_doc and "plan" in plan_doc:
        return {"weekly_plan": plan_doc["plan"]}
    
    # Nếu chưa có, trả về None để Frontend biết đường hiện nút "Tạo mới"
    return {"weekly_plan": None}


@router.post("/weekly-plan")
async def generate_new_weekly_plan(current_user: dict = Depends(get_current_user)):
    diet_modes = current_user.get("diet_modes", [])
    allergens = current_user.get("allergens", [])

    prompt_parts = ["Bạn là chuyên gia dinh dưỡng đẳng cấp thế giới. Hãy lập một lộ trình ăn uống trong 7 ngày (từ Thứ 2 đến Chủ nhật)."]
    if diet_modes: prompt_parts.append(f"- Bắt buộc tuân thủ chế độ ăn: {', '.join(diet_modes)}.")
    if allergens: prompt_parts.append(f"- Tuyệt đối KHÔNG chứa các chất gây dị ứng sau: {', '.join(allergens)}.")

    prompt_parts.append("""
    Kết quả bắt buộc trả về định dạng JSON thuần túy theo mẫu sau:
    {
        "plan": [
            {
                "day": "Thứ 2",
                "meals": {
                    "breakfast": { "name": "Tên món ăn", "calories": 300 },
                    "lunch": { "name": "Tên món ăn", "calories": 500 },
                    "dinner": { "name": "Tên món ăn", "calories": 400 }
                },
                "daily_total_calories": 1200
            }
        ]
    }
    Lưu ý: Tên món ăn bằng tiếng Việt. CHỈ TRẢ VỀ JSON, KHÔNG VIẾT GÌ THÊM.
    """)

    final_prompt = "\n".join(prompt_parts)

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Bạn là chuyên gia dinh dưỡng. Chỉ trả về JSON."},
                {"role": "user", "content": final_prompt}
            ],
            model=MODEL_ID,
            response_format={"type": "json_object"}
        )
        
        res_data = json.loads(chat_completion.choices[0].message.content)
        if "plan" in res_data:
            new_plan = res_data["plan"]
            
            await meal_plans_collection.update_one(
                {"username": current_user["username"]},
                {"$set": {"plan": new_plan}},
                upsert=True
            )
            
            return {"weekly_plan": new_plan}
        else:
            raise Exception("AI trả về sai format")
            
    except Exception as e:
        print(f"Lỗi AI Lộ trình: {e}")
        raise HTTPException(status_code=500, detail="Lỗi khi tạo lộ trình ăn.")