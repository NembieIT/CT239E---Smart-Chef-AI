import { recipes } from "../data/recipes";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { Link } from "react-router";
import { Clock, Flame, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";
import { useState } from "react";

const ITEMS_PER_PAGE = 6;

export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <AnimatedPage>
      <div className="p-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl top-20 right-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-20 left-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <section className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Tất cả công thức
            </h1>
            <p className="text-gray-400">
              Khám phá bộ sưu tập các công thức nấu ăn ngon và lành mạnh
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Tìm kiếm công thức hoặc nguyên liệu..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 glass rounded-2xl border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-300 placeholder:text-gray-600"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-2">
                Tìm thấy {filteredRecipes.length} công thức
              </p>
            )}
          </motion.div>

          {currentRecipes.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  >
                    {currentRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id}
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="glass rounded-3xl overflow-hidden glow-hover group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-purple-100 mb-3 line-clamp-2">
                            {recipe.name}
                          </h3>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Flame className="w-4 h-4 text-pink-400" />
                              <span className="font-semibold text-purple-200">{recipe.calories}</span>
                              <span>kcal</span>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span className="font-semibold text-purple-200">{recipe.cookingTime}</span>
                              <span>phút</span>
                            </div>
                          </div>

                          <Link
                            to={`/recipe/${recipe.id}`}
                            className="relative flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-medium overflow-hidden group/btn"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r bg-blue-600" />
                            <div className="absolute inset-0 bg-gradient-to-r bg-blue-600 blur-md opacity-0 group-hover/btn:opacity-70 transition-opacity" />
                            <span className="relative z-10 text-white">Xem công thức</span>
                            <ArrowRight className="w-4 h-4 text-white relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`cursor-pointer p-3 rounded-xl transition-all ${currentPage === 1
                      ? "glass opacity-50 cursor-not-allowed"
                      : "glass glass-hover text-purple-200"
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(page)}
                        className={`cursor-pointer w-12 h-12 rounded-xl font-semibold transition-all ${currentPage === page
                          ? "bg-gradient-to-r bg-red-800 text-white shadow-lg glow"
                          : "glass text-purple-200 glass-hover"
                          }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`cursor-pointer p-3 rounded-xl transition-all ${currentPage === totalPages
                      ? "glass opacity-50 cursor-not-allowed"
                      : "glass glass-hover text-purple-200"
                      }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-gray-400">
                  Không tìm thấy công thức nào với từ khóa "{searchQuery}"
                </p>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </AnimatedPage>
  );
}