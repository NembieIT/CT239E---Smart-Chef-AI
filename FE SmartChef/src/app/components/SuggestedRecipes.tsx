import { Link } from "react-router";
import { Recipe } from "../types";
import { Clock, Flame, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SuggestedRecipesProps {
  recipes: Recipe[];
}

export function SuggestedRecipes({ recipes }: SuggestedRecipesProps) {
  return (
    <div className="max-w-7xl mx-auto mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Gợi ý công thức nấu ăn
        </h2>
        <p className="text-gray-600">
          Dựa trên những nguyên liệu chúng tôi đã tìm thấy trong ảnh của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
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
                Xem chi tiết
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
