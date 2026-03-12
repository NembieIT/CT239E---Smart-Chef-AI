* Yêu cầu máy đã cài đặt python cũng như python extension trong vscode.
Để khởi động được server backend, hãy cài đặt các thư viện cần có trong requirements.txt
-> py -m pip install -r requirements.txt
Để khởi chạy server
-> python -m uvicorn main:app --reload