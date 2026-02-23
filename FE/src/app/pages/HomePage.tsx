import { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Sparkles,
  ChevronRight,
  Zap,
  Brain,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DetectionResults } from "../components/DetectionResults";
import { SuggestedRecipes } from "../components/SuggestedRecipes";
import {
  AnimatedPage,
  staggerContainer,
  fadeInUp,
} from "../components/AnimatedPage";
import { DetectedFood } from "../types";

// Bộ từ điển để dịch kết quả từ Model sang tiếng Việt
const TRANSLATIONS: Record<string, string> = {
  Eggplant: "Cà tím",
  Carrot: "Cà rốt",
  Patato: "Khoai tây", // Map đúng từ lỗi chính tả trong model của bạn
  Onion: "Hành tây",
};

export function HomePage() {
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Hàm xử lý gửi ảnh lên Backend FastAPI
  const processImageWithAI = async (file: File) => {
    setIsProcessing(true);
    setShowResults(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Gọi đến địa chỉ Backend bạn đã chạy (localhost:8000)
      const response = await fetch("http://localhost:8000/detect-ingredients", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Không thể kết nối Backend");

      const data = await response.json();
      console.log(data);
      // Mapping dữ liệu từ Backend sang định dạng của Frontend
      // const mappedDetections: DetectedFood[] = data.details.map(
      //   (item: any, index: number) => ({
      //     id: index.toString(),
      //     // Dùng từ điển để hiển thị tiếng Việt, nếu không có thì giữ nguyên tên gốc
      //     name: TRANSLATIONS[item.name] || item.name,
      //     confidence: item.confidence,
      //   }),
      // );

      // setDetectedFoods(mappedDetections);
      // setShowResults(true);
    } catch (error) {
      console.error("AI Processing Error:", error);
      alert("Lỗi: Server AI chưa khởi động hoặc gặp sự cố!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        processImageWithAI(file); // Gửi file thực tế đi xử lý
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        processImageWithAI(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const suggestedRecipes = showResults
    ? getRecipesByIngredients(detectedFoods.map((f) => f.name))
    : [];

  const features = [
    {
      icon: Brain,
      title: "AI Thông Minh",
      description: "Nhận diện chính xác 95%+",
    },
    {
      icon: Zap,
      title: "Siêu Nhanh",
      description: "Xử lý dưới 1 giây",
    },
    {
      icon: Target,
      title: "Chính Xác",
      description: "Hàng trăm công thức món ăn",
    },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!showUploadSection ? (
            <motion.div
              key="hero"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0">
                <img
                  src="https://w.wallhaven.cc/full/k8/wallhaven-k81776.jpg"
                  alt="Hero background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/40" />
              </div>

              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-white">
                        Nhận diện hình ảnh với AI
                      </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      Biến Mọi Nguyên Liệu
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 via-red-400 to-white bg-clip-text text-transparent">
                        Thành Món Ăn Tuyệt Vời
                      </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed">
                      Chụp ảnh nguyên liệu, nhận ngay công thức nấu ăn. Đơn
                      giản, nhanh chóng, thông minh với AI.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                      <button
                        onClick={() => setShowUploadSection(true)}
                        className="cursor-pointer group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-700 to-gray-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-white/30 transition-all"
                      >
                        <span>Bắt đầu ngay</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-700 to-gray-500 rounded-xl flex items-center justify-center">
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 overflow-y-auto bg-gray-50"
            >
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-red-700 bg-clip-text text-transparent uppercase p-2">
                    Tải Ảnh Nguyên Liệu
                  </h2>
                  <button
                    onClick={() => {
                      setShowUploadSection(false);
                      setUploadedImage(null);
                      setShowResults(false);
                      setDetectedFoods([]);
                    }}
                    className="mt-4 text-sm text-gray-500 hover:text-red-700 transition-colors"
                  >
                    ← Quay lại trang chủ
                  </button>
                </div>

                <div className="max-w-3xl mx-auto mb-12">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="relative bg-white rounded-3xl shadow-xl border-2 border-dashed border-gray-300 hover:border-red-400 transition-all p-12 text-center group"
                  >
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10">
                        <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                        <p className="mt-6 text-lg font-medium text-gray-700">
                          AI đang phân tích thực phẩm...
                        </p>
                      </div>
                    )}

                    {uploadedImage && !isProcessing ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage}
                          alt="Preview"
                          className="max-h-96 mx-auto rounded-2xl shadow-lg"
                        />
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setShowResults(false);
                            setDetectedFoods([]);
                          }}
                          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                        >
                          Tải ảnh khác
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-700 rounded-2xl mb-4">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Thả hình ảnh vào đây
                          </h3>
                          <p className="text-gray-500 text-sm">
                            hoặc nhấp để chọn từ thiết bị
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-full font-medium hover:shadow-lg transition-all"
                          >
                            <Upload className="w-5 h-5" /> Tải ảnh lên
                          </button>

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
                            className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-red-400 transition-all"
                          >
                            <Camera className="w-5 h-5" /> Mở camera
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {showResults && detectedFoods.length > 0 && (
                  <DetectionResults
                    detectedFoods={detectedFoods}
                    imageUrl={uploadedImage!}
                  />
                )}

                {showResults && suggestedRecipes.length > 0 && (
                  <SuggestedRecipes recipes={suggestedRecipes} />
                )}

                {showResults && suggestedRecipes.length === 0 && (
                  <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-2xl shadow-lg">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      Không tìm thấy công thức
                    </h3>
                    <p className="text-gray-600">
                      Thử tải ảnh khác với nguyên liệu phổ biến hơn
                    </p>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
