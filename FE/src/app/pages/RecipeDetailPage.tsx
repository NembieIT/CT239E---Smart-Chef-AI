import { Link, useLocation } from "react-router";
import { getRecipeById } from "../data/recipes";
import {
  Clock,
  Flame,
  Users,
  ArrowLeft,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react"; // hoặc "framer-motion"
import { AnimatedPage, fadeInUp, staggerContainer } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

export function RecipeDetailPage() {
  const location = useLocation();

  //lấy công thức AI từ location.state (nếu đi từ HomePage sang)
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <AnimatedPage>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="glass rounded-2xl p-8 text-center max-w-md">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-100 mb-2">
              Không tìm thấy công thức
            </h2>
            <Link
              to="/"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // Đảm bảo lấy đúng mảng nguyên liệu (xử lý cả 2 trường hợp tên biến)
  const ingredientsToDisplay = recipe.ingredientsList || recipe.ingredients || [];
  const instructionsToDisplay = recipe.instructions || [];

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl top-20 right-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-pink-500/5 rounded-full blur-3xl bottom-20 left-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Nên quay lại trang chủ thay vì /recipes vì đây là công thức scan AI */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Quay lại Trang chủ</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl overflow-hidden border border-purple-500/20"
          >
            {/* Hero Image */}
            <div className="relative h-96">
              <ImageWithFallback
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  {recipe.name}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4 text-white"
                >
                  <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-purple-500/30">
                    <Flame className="w-5 h-5 text-pink-400" />
                    <span className="font-semibold">{recipe.calories || 0} kcal</span>
                  </div>
                  <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-purple-500/30">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">
                      {recipe.cookTime || recipe.cookingTime || 15} phút
                    </span>
                  </div>
                  <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-purple-500/30">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">
                      {recipe.servings || 1} khẩu phần
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Nutrition Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="md:col-span-3 mb-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Thông tin dinh dưỡng
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="glass rounded-2xl p-6 text-center border border-blue-500/30 glow-hover"
                    >
                      <p className="text-3xl font-bold text-blue-400 mb-1">
                        {recipe.protein || recipe.nutrition?.protein || 0}g
                      </p>
                      <p className="text-sm text-gray-400">Protein</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="glass rounded-2xl p-6 text-center border border-yellow-500/30 glow-hover"
                    >
                      <p className="text-3xl font-bold text-yellow-400 mb-1">
                        {recipe.carbs || recipe.nutrition?.carbs || 0}g
                      </p>
                      <p className="text-sm text-gray-400">Carbs</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="glass rounded-2xl p-6 text-center border border-orange-500/30 glow-hover"
                    >
                      <p className="text-3xl font-bold text-orange-400 mb-1">
                        {recipe.fat || recipe.nutrition?.fat || 0}g
                      </p>
                      <p className="text-sm text-gray-400">Chất béo</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Ingredients */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="md:col-span-1"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    Nguyên liệu
                  </h2>
                  <div className="glass rounded-2xl p-6 border border-purple-500/20">
                    <ul className="space-y-3">
                      {ingredientsToDisplay.map((ingredient: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{ingredient}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="md:col-span-2"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    Hướng dẫn nấu ăn
                  </h2>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                  >
                    {instructionsToDisplay.map((instruction: string, index: number) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ x: 5 }}
                        className="flex gap-4 glass border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 transition-all"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br bg-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 flex-1 pt-1.5">
                          {instruction}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}