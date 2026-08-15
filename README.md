## Overview
SmartChefAI là một ứng dụng thông minh hỗ trợ nhận diện món ăn và nguyên liệu thông qua hình ảnh. Ứng dụng giúp người dùng phân tích thành phần dinh dưỡng, gợi ý công thức nấu ăn dựa trên những nguyên liệu có sẵn, và quản lý thực đơn hàng ngày một cách hiệu quả.

## Features
- Nhận diện hình ảnh AI: Tải lên hình ảnh nguyên liệu hoặc món ăn để hệ thống tự động nhận diện và phân loại.

- Gợi ý công thức nấu ăn: Đề xuất các món ăn có thể nấu dựa trên danh sách nguyên liệu bạn đang có.

- Phân tích dinh dưỡng: Ước tính lượng calo, protein, chất béo và các chỉ số dinh dưỡng khác của món ăn.

- Quản lý thực đơn: Lưu trữ các công thức yêu thích và lên kế hoạch bữa ăn theo tuần.

## Architecture
Hệ thống được thiết kế theo mô hình Client-Server. Frontend sẽ xử lý giao diện và tương tác người dùng, gửi các yêu cầu hình ảnh lên Backend. Backend đóng vai trò như một API Gateway, xử lý logic nghiệp vụ, giao tiếp với cơ sở dữ liệu và gọi đến các dịch vụ AI bên ngoài (như Google Vision AI hoặc các mô hình nhận diện tùy chỉnh) để phân tích hình ảnh trả về kết quả cho máy khách.

## Tech Stack
- Frontend: ReactJS, TypeScript, Zustand (quản lý state).

- Backend: Python (FastAPI/Flask), YOLOv8 (Ultralytics) cho AI/ML.

- Database: MongoDB Atlas.

## Project Structure
```text
SmartChefAI/
├── FE/                     # Nền tảng Frontend (React/Vite)
│   ├── guidelines/
│   │   └── Guidelines.md
│   ├── src/
│   │   ├── app/
│   │   ├── imports/
│   │   ├── styles/
│   │   └── main.tsx
│   ├── ATTRIBUTIONS.md
│   ├── README.md
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── vite.config.ts
│   └── .gitignore
└── BE/                     # Nền tảng Backend (Python)
    ├── model/
    │   └── best.pt         # Trọng số mô hình AI đã train
    ├── routers/            # Các API endpoints
    │   ├── __pycache__/
    │   ├── auth.py         # Xử lý xác thực người dùng
    │   ├── detect.py       # Xử lý nhận diện hình ảnh
    │   └── recipe.py       # Xử lý gợi ý công thức
    ├── database.py         # Kết nối cơ sở dữ liệu
    ├── main.py             # Entry point của Backend
    ├── readme.md
    ├── requirements.txt    # Danh sách thư viện Python
    ├── security.py         # Cấu hình bảo mật
    └── yolov8n.pt          # Mô hình YOLOv8 gốc
```
## Installation
1. Khởi chạy Backend (Python)
Mở terminal và di chuyển vào thư mục BE:
Yêu cầu máy đã cài đặt python cũng như python extension trong vscode. 
py -m pip install -r requirements.txt 
python -m uvicorn main:app --reload

2. Khởi chạy Frontend (React/Vite)
Mở một terminal khác và di chuyển vào thư mục FE:
cd FE
npm install
npm run dev
