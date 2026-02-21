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
import { ImageWithFallback } from "../components/imgFallback/ImageWithFallback";

export function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = id ? getRecipeById(id) : undefined;

  // Hiển thị khi không tìm thấy công thức
  if (!recipe) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy công thức nấu ăn
          </h2>
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Nút quay lại */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại trang chủ</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Ảnh bìa món ăn */}
          <div className="relative h-96">
            <ImageWithFallback
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {recipe.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold">{recipe.calories} kcal</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">
                    {recipe.cookingTime} phút
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">
                    {recipe.servings} khẩu phần
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Thông tin dinh dưỡng */}
              <div className="md:col-span-3 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Giá trị dinh dưỡng (Nutrition Facts)
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center transition-colors hover:bg-blue-100">
                    <p className="text-3xl font-bold text-blue-600 mb-1">
                      {recipe.nutrition.protein}g
                    </p>
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                      Đạm (Protein)
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 text-center transition-colors hover:bg-yellow-100">
                    <p className="text-3xl font-bold text-yellow-600 mb-1">
                      {recipe.nutrition.carbs}g
                    </p>
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                      Tinh bột (Carbs)
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center transition-colors hover:bg-orange-100">
                    <p className="text-3xl font-bold text-orange-600 mb-1">
                      {recipe.nutrition.fat}g
                    </p>
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                      Chất béo (Fat)
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách nguyên liệu */}
              <div className="md:col-span-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Nguyên liệu chuẩn bị
                </h2>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-inner">
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 font-medium"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Các bước nấu ăn */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Hướng dẫn thực hiện
                </h2>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-green-200 transition-all group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold group-hover:bg-green-600 transition-colors">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1 pt-1.5 leading-relaxed font-medium">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
