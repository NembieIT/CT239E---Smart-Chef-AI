import { Clock, Sparkles, X, Flame, Users, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";
import { useState } from "react";

interface HistoryItem {
  id: string;
  image: string;
  detectedItems: number;
  timestamp: string;
  topIngredients: string[];
  recipe?: {
    name: string;
    calories: number;
    servings: number;
    ingredients: string[];
    instructions: string[];
  };
}

export function HistoryPage() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const history: HistoryItem[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      detectedItems: 5,
      timestamp: "2 giờ trước",
      topIngredients: ["Cà chua", "Dưa chuột", "Ớt chuông"],
      recipe: {
        name: "Salad Rau Củ Tươi",
        calories: 280,
        servings: 2,
        ingredients: [
          "2 quả cà chua",
          "1 quả dưa chuột",
          "1 quả ớt chuông",
          "1/2 củ hành tây",
          "Dầu ô liu",
          "Nước cốt chanh",
          "Muối và tiêu",
        ],
        instructions: [
          "Rửa sạch tất cả rau củ",
          "Thái cà chua thành miếng vừa ăn",
          "Cắt dưa chuột thành lát mỏng",
          "Thái ớt chuông thành sợi",
          "Trộn tất cả vào bát lớn",
          "Thêm dầu ô liu, nước cốt chanh",
          "Nêm muối tiêu vừa ăn",
          "Trộn đều và dùng ngay",
        ],
      },
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      detectedItems: 3,
      timestamp: "1 ngày trước",
      topIngredients: ["Salad", "Bơ", "Chanh"],
      recipe: {
        name: "Salad Bơ Chanh",
        calories: 350,
        servings: 2,
        ingredients: [
          "2 quả bơ chín",
          "1 quả chanh",
          "Rau salad hỗn hợp",
          "Hạt chia",
          "Dầu ô liu",
          "Mật ong",
        ],
        instructions: [
          "Bóc vỏ bơ và cắt lát",
          "Rửa sạch rau salad",
          "Xếp rau lên đĩa",
          "Đặt lát bơ lên trên",
          "Vắt nước chanh",
          "Rưới dầu ô liu và mật ong",
          "Rắc hạt chia",
          "Dùng ngay",
        ],
      },
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      detectedItems: 4,
      timestamp: "3 ngày trước",
      topIngredients: ["Pizza", "Phô mai", "Cà chua"],
      recipe: {
        name: "Pizza Margherita",
        calories: 580,
        servings: 4,
        ingredients: [
          "Bột làm bánh pizza",
          "Sốt cà chua",
          "Phô mai mozzarella",
          "Lá húng quế tươi",
          "Dầu ô liu",
          "Muối",
        ],
        instructions: [
          "Làm nóng lò nướng 220°C",
          "Cán mỏng bột pizza",
          "Phết sốt cà chua đều",
          "Rắc phô mai lên trên",
          "Nướng 12-15 phút",
          "Lấy ra khỏi lò",
          "Rắc lá húng quế tươi",
          "Cắt và dùng nóng",
        ],
      },
    },
  ];

  return (
    <AnimatedPage>
      <div className="p-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl top-20 left-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-20 right-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <section className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lịch sử quét
            </h1>
            <p className="text-gray-400">
              Xem lại các lần quét thực phẩm và nguyên liệu đã nhận diện trước đây
            </p>
          </motion.div>

          {history.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedItem(item)}
                  className="glass rounded-3xl overflow-hidden glow-hover cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt="Thực phẩm đã quét"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
                      <div className="flex items-center gap-1 text-sm">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-purple-200">
                          {item.detectedItems} món
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Clock className="w-4 h-4" />
                      {item.timestamp}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.topIngredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 glass text-purple-200 rounded-full text-sm font-medium border border-purple-500/20"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-100 mb-2">
                  Chưa có lịch sử
                </h3>
                <p className="text-gray-400">
                  Bắt đầu tải lên hình ảnh thực phẩm để xem lịch sử quét của bạn
                </p>
              </div>
            </motion.div>
          )}
        </section>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && selectedItem.recipe && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />

              {/* Modal Content */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-purple-500/30"
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 glass border-b border-purple-500/20 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
                    <div>
                      <h2 className="text-2xl font-bold text-purple-100">
                        {selectedItem.recipe.name}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {selectedItem.timestamp}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedItem(null)}
                      className="p-2 glass hover:bg-purple-500/20 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </motion.button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8">
                    {/* Image */}
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.recipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-purple-500/20">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Flame className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Calories</p>
                          <p className="text-xl font-bold text-purple-100">
                            {selectedItem.recipe.calories} kcal
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-purple-500/20">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Khẩu phần</p>
                          <p className="text-xl font-bold text-purple-100">
                            {selectedItem.recipe.servings} người
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Nguyên liệu
                      </h3>
                      <div className="glass rounded-2xl p-6 border border-purple-500/20">
                        <ul className="space-y-3">
                          {selectedItem.recipe.ingredients.map((ingredient, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 text-gray-300"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{ingredient}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                        Hướng dẫn thực hiện
                      </h3>
                      <div className="space-y-4">
                        {selectedItem.recipe.instructions.map((instruction, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-4 glass border border-purple-500/20 rounded-2xl p-5"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {index + 1}
                            </div>
                            <p className="text-gray-300 flex-1 pt-1.5">
                              {instruction}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}