import { Brain, Camera, ChefHat, Sparkles, Target, Zap } from "lucide-react";

export function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Nhận diện bằng AI",
      description:
        "Mô hình học máy tiên tiến giúp phát hiện và định danh nhiều loại thực phẩm với độ chính xác cao.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Camera,
      title: "Nhận diện tức thì",
      description:
        "Tải ảnh hoặc chụp trực tiếp để nhận diện nguyên liệu và xem độ tin cậy của AI ngay lập tức.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ChefHat,
      title: "Gợi ý món ăn thông minh",
      description:
        "Nhận các đề xuất công thức nấu ăn cá nhân hóa dựa trên những nguyên liệu đã được phát hiện.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Theo dõi dinh dưỡng",
      description:
        "Xem chi tiết lượng calo và bảng phân tích dinh dưỡng cho mọi công thức nấu ăn.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Tốc độ cực nhanh",
      description:
        "Xử lý hình ảnh chỉ trong vài giây với hạ tầng AI đã được tối ưu hóa.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Sparkles,
      title: "Học hỏi liên tục",
      description:
        "AI của chúng tôi liên tục cải thiện qua mỗi lần quét để mang lại kết quả chính xác hơn.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
            Về Smart Chef AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cách mạng hóa cách bạn khám phá công thức nấu ăn thông qua sức mạnh
            của Trí tuệ nhân tạo và công nghệ Thị giác máy tính.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chúng tôi tin rằng nấu ăn nên đơn giản, thú vị và dễ dàng tiếp cận
              với mọi người. Smart Chef AI kết hợp trí tuệ nhân tạo tiên tiến
              với niềm đam mê ẩm thực để giúp bạn biến bất kỳ nguyên liệu nào
              thành những bữa ăn ngon lành. Dù bạn là người mới hay đầu bếp
              chuyên nghiệp, nền tảng của chúng tôi giúp việc khám phá món ăn
              trở nên dễ dàng hơn.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Tính năng vượt trội
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Công nghệ hiện đại
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Được vận hành bởi React, Tailwind CSS và mô hình học máy YOLOv8 tối
            tân nhất.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["React", "TypeScript", "Tailwind CSS", "YOLOv8"].map((tech) => (
              <div
                key={tech}
                className="bg-white rounded-2xl p-6 text-center shadow-md"
              >
                <p className="font-bold text-gray-800">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
