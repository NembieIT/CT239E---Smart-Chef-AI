import { useState, useRef } from "react";
import { Upload, Camera, Sparkles, X } from "lucide-react";
import { DetectionResults } from "../components/DetectionResults";
import { SuggestedRecipes } from "../components/SuggestedRecipes";
import { getRecipesByIngredients } from "../data/recipes";
import { foodService } from "../../services/api"; // Kết nối với file api.ts của bạn
import { toast } from "sonner";

export function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  /**
   * Xử lý khi người dùng chọn file hoặc chụp ảnh
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      handleProcessImage(file);
    }
  };

  /**
   * Gọi Service để gửi ảnh lên Backend BEYOLO
   */
  const handleProcessImage = async (file: File) => {
    setIsProcessing(true);
    setShowResults(false);

    try {
      // Sử dụng service độc lập bạn đã tạo
      const results = await foodService.detectIngredients(file);

      setDetectedFoods(results);
      setShowResults(true);
      toast.success("Nhận diện nguyên liệu thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ AI. Vui lòng kiểm tra Backend!");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Lọc công thức dựa trên tên nguyên liệu (Tiếng Anh) từ AI
   */
  const suggestedRecipes = showResults
    ? getRecipesByIngredients(detectedFoods.map((f) => f.name))
    : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Phần Tiêu đề chính */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-4 border border-green-100 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Công nghệ AI nhận diện thực phẩm</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight">
            Smart Chef AI
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Chụp ảnh hoặc tải lên hình ảnh nguyên liệu để nhận gợi ý món ăn ngay
            lập tức
          </p>
        </div>

        {/* Khu vực Tải ảnh / Camera */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl border-4 border-dashed border-slate-100 hover:border-green-400 transition-all p-10 text-center group">
            {/* Trạng thái đang xử lý (Loading) */}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center z-20">
                <div className="w-20 h-20 border-8 border-green-100 border-t-green-600 rounded-full animate-spin" />
                <p className="mt-8 text-xl font-black text-slate-800 uppercase tracking-tighter">
                  Hệ thống đang phân tích...
                </p>
              </div>
            )}

            {/* Hiển thị ảnh sau khi tải lên */}
            {uploadedImage && !isProcessing ? (
              <div className="space-y-6">
                <div className="relative inline-block group">
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="max-h-96 mx-auto rounded-3xl shadow-2xl border-4 border-white"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setShowResults(false);
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-sm font-bold uppercase transition-all shadow-lg"
                  >
                    Thay đổi ảnh
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div
                  className="mb-8 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100">
                    <Upload className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase mb-2">
                    Tải ảnh lên
                  </h3>
                  <p className="text-slate-400 font-medium">
                    Kéo thả hoặc nhấn để duyệt file ảnh
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Input ẩn */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:border-green-500 hover:text-green-600 rounded-2xl font-bold transition-all shadow-sm"
                  >
                    <Camera className="w-6 h-6" />
                    <span>Mở Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Khu vực Hiển thị kết quả */}
        {showResults && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {detectedFoods.length > 0 ? (
              <>
                <DetectionResults
                  detectedFoods={detectedFoods}
                  imageUrl={uploadedImage!}
                />
                <SuggestedRecipes recipes={suggestedRecipes} />
              </>
            ) : (
              <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-xl max-w-2xl mx-auto border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">
                  AI không nhận diện được nguyên liệu nào. Vui lòng thử lại với
                  ảnh rõ nét hơn!
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
