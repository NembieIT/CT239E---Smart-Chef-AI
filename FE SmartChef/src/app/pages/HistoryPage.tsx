import { Clock, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/imgFallback/ImageWithFallback";

export function HistoryPage() {
  const history = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      detectedItems: 5,
      timestamp: "2 giờ trước",
      topIngredients: ["Cà chua", "Hành tây", "Ớt chuông"],
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      detectedItems: 3,
      timestamp: "1 ngày trước",
      topIngredients: ["Trứng", "Hành tây", "Tôm"],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            Lịch sử quét ảnh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Xem lại các lần nhận diện thực phẩm và nguyên liệu bạn đã thực hiện
          </p>
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt="Ảnh đã quét"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      {item.detectedItems} nguyên liệu
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" /> {item.timestamp}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.topIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-br from-green-50 to-orange-50 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chưa có lịch sử
              </h3>
              <p className="text-gray-600">
                Bắt đầu tải ảnh lên để lưu lại lịch sử nhận diện của bạn.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
