import { Link, useLocation, useNavigate } from "react-router";
import { Clock, Flame, Users, ArrowLeft, Activity } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { AnimatedPage } from "../components/AnimatedPage";
import { ImageWithFallback } from "../components/imgFallBack/ImageWithFallback";

export function RecipeDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityImage = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);

  if (!recipe) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-12 text-center max-w-md">
            <Activity className="w-12 h-12 text-zinc-600 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Không tìm thấy dữ liệu</h2>
            <p className="text-zinc-500 text-sm mb-6">Công thức này không tồn tại hoặc đã bị xóa.</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">Về trang chủ</button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const safeArray = (data: any) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return data.includes('\n') ? data.split('\n').filter(Boolean) : [data];
    if (data) return [String(data)];
    return [];
  };

  const ingredientsToDisplay = safeArray(recipe.ingredientsList || recipe.ingredients);
  const instructionsToDisplay = safeArray(recipe.instructions);

  return (
    <ReactLenis root>
      <AnimatedPage>
        <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black pb-32">
          
          {/* Hero Image Parallax */}
          <div className="fixed inset-0 h-[75vh] z-0 overflow-hidden bg-black">
            <motion.div style={{ y: yImage, opacity: opacityImage }} className="w-full h-full">
              <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-full object-cover filter brightness-[0.6] contrast-125 saturate-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </motion.div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10">
            <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => window.history.back()} className="mb-24 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] hover:bg-white/10 border border-white/5 rounded-full text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Trở về
            </motion.button>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8 max-w-4xl">
                {recipe.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-[#0A0A0A] px-5 py-3 rounded-full border border-white/5">
                  <Flame className="w-4 h-4 text-zinc-400" /> <span className="font-semibold text-sm">{recipe.calories || 0} kcal</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0A0A0A] px-5 py-3 rounded-full border border-white/5">
                  <Clock className="w-4 h-4 text-zinc-400" /> <span className="font-semibold text-sm">{recipe.cookTime || recipe.cookingTime || 15} phút</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0A0A0A] px-5 py-3 rounded-full border border-white/5">
                  <Users className="w-4 h-4 text-zinc-400" /> <span className="font-semibold text-sm">{recipe.servings || 1} phần</span>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-12 gap-8">
              {/* Cột trái */}
              <div className="md:col-span-4 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/5">
                  <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Giá trị dinh dưỡng</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-zinc-400 text-sm">Protein</span>
                      <span className="text-xl font-bold">{recipe.protein || recipe.nutrition?.protein || 0}<span className="text-sm font-normal text-zinc-600 ml-1">g</span></span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-zinc-400 text-sm">Carbs</span>
                      <span className="text-xl font-bold">{recipe.carbs || recipe.nutrition?.carbs || 0}<span className="text-sm font-normal text-zinc-600 ml-1">g</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm">Chất béo</span>
                      <span className="text-xl font-bold">{recipe.fat || recipe.nutrition?.fat || 0}<span className="text-sm font-normal text-zinc-600 ml-1">g</span></span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/5">
                  <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Nguyên liệu</h2>
                  <ul className="space-y-4">
                    {ingredientsToDisplay.map((ingredient: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Cột phải */}
              <div className="md:col-span-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#0A0A0A] rounded-3xl p-8 md:p-10 border border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-8">Hướng dẫn thực hiện</h2>
                  <div className="space-y-8">
                    {instructionsToDisplay.map((instruction: string, index: number) => (
                      <div key={index} className="flex gap-6 group">
                        <div className="shrink-0 text-sm font-bold text-zinc-600 group-hover:text-white transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <p className="text-zinc-300 text-base leading-relaxed">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </ReactLenis>
  );
}