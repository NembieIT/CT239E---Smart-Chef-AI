import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";
import { Link } from "react-router";
import { Clock, Flame, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/imgFallback/ImageWithFallback";
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

  // Pagination logic
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

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r bg-green-600 bg-clip-text text-transparent uppercase p-2">
              Tất cả công thức
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập các công thức nấu ăn ngon và lành mạnh
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm công thức hoặc nguyên liệu..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Tìm thấy {filteredRecipes.length} công thức
              </p>
            )}
          </motion.div>

          {currentRecipes.length > 0 ? (
            <>
              {/* Recipes Grid with AnimatePresence for smooth transitions */}
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
                        className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                            {recipe.name}
                          </h3>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span className="font-semibold">{recipe.calories}</span>
                              <span>kcal</span>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span className="font-semibold">{recipe.cookingTime}</span>
                              <span>phút</span>
                            </div>
                          </div>

                          <Link
                            to={`/recipe/${recipe.id}`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all group-hover:gap-3"
                          >
                            Xem công thức
                            <ArrowRight className="w-4 h-4" />
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
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-3 rounded-xl transition-all ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md hover:shadow-lg"
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all ${currentPage === page
                          ? "bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg scale-110"
                          : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md hover:shadow-lg"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-3 rounded-xl transition-all ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md hover:shadow-lg"
                      }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
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
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600">
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
