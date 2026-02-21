import axios from "axios";

// Cấu hình URL mặc định của Backend
const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const foodService = {
  /**
   * Gửi ảnh lên server để nhận diện nguyên liệu
   * @param file Tệp tin ảnh từ người dùng
   */
  async detectIngredients(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/detect-ingredients", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Chuẩn hóa dữ liệu trả về để Frontend dùng luôn
      return response.data.details.map((item: any, index: number) => ({
        id: `food-${index}-${Date.now()}`,
        name: item.name,
        confidence: item.confidence,
      }));
    } catch (error) {
      console.error("Lỗi API Nhận diện:", error);
      throw error;
    }
  },

  /**
   * Ví dụ: Hàm lấy lịch sử quét từ Backend (nếu sau này bạn làm Database)
   */
  async getScanHistory() {
    const response = await api.get("/history");
    return response.data;
  },
};
