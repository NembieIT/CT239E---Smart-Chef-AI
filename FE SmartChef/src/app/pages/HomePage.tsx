import { useState, useRef } from "react";
import { Upload, Camera, Sparkles, ChevronRight, Zap, Brain, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DetectionResults } from "../components/DetectionResults";
import { SuggestedRecipes } from "../components/SuggestedRecipes";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { DetectedFood } from "../types";
import { getRecipesByIngredients } from "../data/recipes";

export function HomePage() {
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        processImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    setIsProcessing(true);
    setShowResults(false);

    // Simulate AI processing
    setTimeout(() => {
      const mockDetections: DetectedFood[] = [
        { id: "1", name: "Cà chua", confidence: 95.8 },
        { id: "2", name: "Dưa chuột", confidence: 92.3 },
        { id: "3", name: "Ớt chuông", confidence: 89.7 },
        { id: "4", name: "Hành tây", confidence: 87.4 },
        { id: "5", name: "Dầu ô liu", confidence: 78.2 },
      ];
      setDetectedFoods(mockDetections);
      setIsProcessing(false);
      setShowResults(true);
    }, 2500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        processImage();
      };
      reader.readAsDataURL(file);
    }
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
      description: "Xử lý trong 2 giây",
    },
    {
      icon: Target,
      title: "Chính Xác",
      description: "100+ công thức món ăn",
    },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!showUploadSection ? (
            // Hero Section
            <motion.div
              key="hero"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* ảnh nền */}
              <div className="absolute inset-0">
                <img
                  src="https://w.wallhaven.cc/full/k8/wallhaven-k81776.jpg"
                  alt="Hero background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl"
                  >
                    {/* giới thiệu (badge) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
                    >
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-white">
                        Nhận diện hình ảnh với AI
                      </span>
                    </motion.div>

                    {/* tiêu đề */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                      Biến Mọi Nguyên Liệu
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 via-red-400 to-white bg-clip-text text-transparent">
                        Thành Món Ăn Tuyệt Vời
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed"
                    >
                      Chụp ảnh nguyên liệu, nhận ngay công thức nấu ăn.
                      Đơn giản, nhanh chóng, thông minh với AI.
                    </motion.p>

                    {/* nút bắt đầu với demo */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4 mb-16"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowUploadSection(true)}
                        className="cursor-pointer group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-700 to-gray text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-white/30 transition-all"
                      >
                        <span>Bắt đầu ngay</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all"
                      >
                        {/* dự định khi click vào rồi sẽ pop up video demo sử dụng tính năng */}
                        <span>Xem demo</span>
                      </motion.button>
                    </motion.div>

                    {/* Các tính năng */}
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          custom={index}
                          className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-700 to-gray rounded-xl flex items-center justify-center">
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
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Upload Section
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 overflow-y-auto"
            >
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r bg-red-700 bg-clip-text text-transparent uppercase p-2 font-saira">
                    Tải Ảnh Nguyên Liệu
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Chọn hoặc chụp ảnh thực phẩm để AI nhận diện và gợi ý công thức
                  </p>
                  <button
                    onClick={() => {
                      setShowUploadSection(false);
                      setUploadedImage(null);
                      setShowResults(false);
                      setDetectedFoods([]);
                    }}
                    className="mt-4 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    ← Quay lại trang chủ
                  </button>
                </motion.div>

                {/* Upload Box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="max-w-3xl mx-auto mb-12"
                >
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="relative bg-white rounded-3xl shadow-xl border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all p-12 text-center group"
                  >
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10">
                        <div className="relative">
                          <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                          <Sparkles className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <p className="mt-6 text-lg font-medium text-gray-700">
                          Đang phân tích hình ảnh...
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          AI đang nhận diện nguyên liệu
                        </p>
                      </div>
                    )}

                    {uploadedImage && !isProcessing ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <img
                          src={uploadedImage}
                          alt="Thực phẩm đã tải lên"
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
                          Tải lên hình ảnh khác
                        </button>
                      </motion.div>
                    ) : !isProcessing ? (
                      <>
                        <div className="mb-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-700 to-gray-500 rounded-2xl mb-4 transition-transform">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Thả hình ảnh thực phẩm vào đây
                          </h3>
                          <p className="text-gray-500 text-sm">
                            hoặc nhấp để chọn từ thiết bị của bạn
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
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r cursor-pointer bg-red-700 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
                          >
                            <Upload className="w-5 h-5" />
                            Tải ảnh lên
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
                            className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-orange-400 hover:shadow-lg transition-all"
                          >
                            <Camera className="w-5 h-5" />
                            Mở camera
                          </button>
                        </div>

                        <p className="mt-6 text-xs text-gray-400">
                          Định dạng hỗ trợ: JPG, PNG, WebP (Tối đa 10MB)
                        </p>
                      </>
                    ) : null}
                  </div>
                </motion.div>

                {/* Detection Results */}
                {showResults && detectedFoods.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DetectionResults
                      detectedFoods={detectedFoods}
                      imageUrl={uploadedImage!}
                    />
                  </motion.div>
                )}

                {/* Suggested Recipes */}
                {showResults && suggestedRecipes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <SuggestedRecipes recipes={suggestedRecipes} />
                  </motion.div>
                )}

                {/* No Results Message */}
                {showResults && suggestedRecipes.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-2xl mx-auto text-center py-12"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Không tìm thấy công thức phù hợp
                      </h3>
                      <p className="text-gray-600">
                        Thử tải lên hình ảnh khác với nguyên liệu phổ biến hơn
                      </p>
                    </div>
                  </motion.div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
