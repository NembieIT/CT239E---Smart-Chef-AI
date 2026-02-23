import { useParams, Link } from "react-router";
import { getRecipeById } from "../data/recipes";
import {
  Clock,
  Flame,
  Users,
  ArrowLeft,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";
import { AnimatedPage, fadeInUp, staggerContainer } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallback/ImageWithFallback";

export function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = id ? getRecipeById(id) : undefined;

  if (!recipe) {
    return (
      <AnimatedPage>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy công thức
            </h2>
            <Link
              to="/"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại trang chủ</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-96">
              <ImageWithFallback
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold">{recipe.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="font-semibold">
                      {recipe.cookingTime} phút
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">
                      {recipe.servings} khẩu phần
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
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Thông tin dinh dưỡng
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center"
                    >
                      <p className="text-3xl font-bold text-blue-600 mb-1">
                        {recipe.nutrition.protein}g
                      </p>
                      <p className="text-sm text-gray-600">Protein</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 text-center"
                    >
                      <p className="text-3xl font-bold text-yellow-600 mb-1">
                        {recipe.nutrition.carbs}g
                      </p>
                      <p className="text-sm text-gray-600">Carbs</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center"
                    >
                      <p className="text-3xl font-bold text-orange-600 mb-1">
                        {recipe.nutrition.fat}g
                      </p>
                      <p className="text-sm text-gray-600">Chất béo</p>
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Nguyên liệu
                  </h2>
                  <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-6">
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Hướng dẫn nấu ăn
                  </h2>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                  >
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        custom={index}
                        className="flex gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1 pt-1.5">
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
