import { CheckCircle2, Percent } from "lucide-react";
import { DetectedFood } from "../types";
import { ingredientsTRANSLATIONS } from "../data/translation";

// 1. Cập nhật Interface để nhận thêm imageUrl
interface DetectionResultsProps {
  detectedFoods: DetectedFood[];
  imageUrl: string;
}

export function DetectionResults({
  detectedFoods,
  imageUrl,
}: DetectionResultsProps) {
  return (
    <div className="max-w-3xl mx-auto mb-16">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="grid md:grid-cols-2">
          {/* Cột trái: Hiển thị lại ảnh đã tải lên */}
          <div className="relative h-64 md:h-auto bg-slate-100">
            <img
              src={imageUrl}
              alt="Ảnh phân tích"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 p-2">
                Ảnh đã phân tích
              </span>
            </div>
          </div>

          {/* Cột phải: Danh sách nguyên liệu */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight p-2">
                  Nguyên liệu tìm thấy
                </h2>
                <p className="text-sm text-slate-400 font-medium">
                  {detectedFoods.length} thành phần được AI xác nhận
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {detectedFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-green-200 hover:bg-green-50/50 transition-all"
                >
                  <span className="font-bold text-slate-700">
                    {/* Dịch tên sang Tiếng Việt */}
                    {ingredientsTRANSLATIONS[food.name.toLowerCase()] || food.name}
                  </span>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100">
                    <Percent className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-black text-slate-800">
                      {food.confidence.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
