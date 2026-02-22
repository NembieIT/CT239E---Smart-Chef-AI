import {
  Brain,
  Camera,
  ChefHat,
  Sparkles,
  Target,
  Zap,
  GraduationCap,
  Users,
  Github,
  Mail,
} from "lucide-react";
import { motion } from "motion/react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";

export function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Nhận diện bằng AI",
      description:
        "Mô hình học máy tiên tiến phát hiện và xác định nhiều loại thực phẩm với độ chính xác cao.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Camera,
      title: "Phát hiện tức thì",
      description:
        "Tải lên hoặc chụp ảnh để nhận được kết quả nhận diện nguyên liệu và điểm tin cậy ngay lập tức.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ChefHat,
      title: "Gợi ý công thức thông minh",
      description:
        "Nhận đề xuất công thức cá nhân hóa dựa trên các nguyên liệu đã phát hiện.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Theo dõi dinh dưỡng",
      description:
        "Xem số lượng calo chi tiết và phân tích dinh dưỡng cho mỗi công thức.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Siêu nhanh",
      description:
        "Xử lý hình ảnh trong vài giây với cơ sở hạ tầng AI được tối ưu hóa.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Sparkles,
      title: "Học tập liên tục",
      description:
        "AI của chúng tôi cải thiện theo thời gian, học hỏi từ mỗi lần quét để cung cấp kết quả tốt hơn.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const teamMembers = [
    {
      name: "Phan Mỹ Phú",
      role: "AI Engineer & Full-stack Developer",
      description: "Phát triển mô hình AI nhận diện thực phẩm và xây dựng hệ thống backend",
      avatar: "https://ui-avatars.com/api/?name=Phan+My+Phu&background=f97316&color=fff&size=200&bold=true",
      email: "phanmyphu@example.com",
      github: "phanmyphu",
    },
    {
      name: "Mai Tiến Dũng",
      role: "Frontend Developer & UI/UX Designer",
      description: "Thiết kế giao diện người dùng và phát triển frontend application",
      avatar: "https://ui-avatars.com/api/?name=Mai+Tien+Dung&background=22c55e&color=fff&size=200&bold=true",
      email: "maitiendung@example.com",
      github: "maitiendung",
    },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">
                Đồ Án Niên Luận
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent uppercase p-2">
              AI Nhận Diện Thực Phẩm
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ứng dụng web sử dụng AI để nhận diện nguyên liệu và đề xuất công thức nấu ăn
            </p>
          </motion.div>

          {/* Project Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-100"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Về Dự Án
                  </h2>
                  <p className="text-gray-500">Năm học 2025-2026</p>
                </div>
              </div>

              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">AI Nhận Diện Thực Phẩm</strong> là đồ án niên luận
                  được phát triển nhằm ứng dụng công nghệ trí tuệ nhân tạo và thị giác máy tính
                  vào lĩnh vực ẩm thực.
                </p>
                <p>
                  Hệ thống cho phép người dùng chụp ảnh hoặc tải lên hình ảnh thực phẩm,
                  sau đó sử dụng mô hình AI để nhận diện các nguyên liệu có trong ảnh
                  với độ chính xác cao. Dựa trên kết quả nhận diện, ứng dụng sẽ gợi ý
                  các công thức nấu ăn phù hợp kèm theo thông tin dinh dưỡng chi tiết.
                </p>
                <p>
                  Dự án được xây dựng với mục tiêu tạo ra một công cụ hữu ích giúp mọi người
                  dễ dàng khám phá và sáng tạo các món ăn từ nguyên liệu sẵn có,
                  đồng thời nâng cao nhận thức về dinh dưỡng và sức khỏe.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%+</div>
                  <div className="text-sm text-gray-600">Độ chính xác AI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Công thức món ăn</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2s</div>
                  <div className="text-sm text-gray-600">Thời gian xử lý</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-8 h-8 text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-800">
                  Nhóm Phát Triển
                </h2>
              </div>
              <p className="text-gray-600">
                Đội ngũ sinh viên đam mê công nghệ và ẩm thực
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-400 rounded-full blur-xl opacity-50" />
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-orange-100 to-green-100 rounded-full mb-4">
                      <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {member.description}
                    </p>

                    {/* Contact */}
                    <div className="flex gap-3 w-full">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Email</span>
                      </a>
                      <a
                        href={`https://github.com/${member.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors"
                      >
                        <Github className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white">GitHub</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold text-center text-gray-800 mb-12"
            >
              Tính năng nổi bật
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    custom={index}
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all border border-gray-100"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Công nghệ sử dụng
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Xây dựng với các công nghệ web hiện đại và framework AI tiên tiến
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "React", desc: "UI Framework" },
                { name: "TypeScript", desc: "Type Safety" },
                { name: "Tailwind CSS", desc: "Styling" },
                { name: "AI/ML", desc: "Computer Vision" },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                >
                  <p className="font-bold text-gray-800 mb-1">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </AnimatedPage>
  );
}
