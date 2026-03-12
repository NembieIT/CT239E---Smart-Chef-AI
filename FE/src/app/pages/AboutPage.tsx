import { motion } from "motion/react";
import {
  Info,
  BrainCircuit,
  Code2,
  Terminal,
  Database,
  UserCircle2,
  Cpu,
  Sparkles,
  Github
} from "lucide-react";
import { AnimatedPage } from "../components/AnimatedPage"; // Đảm bảo đường dẫn này đúng với project của bạn

export function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
        {/* Tiêu đề trang */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 border border-cyan-500/30 glow-cyan">
            <Info className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">
            Về Dự Án
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hệ thống nhận diện nguyên liệu và đề xuất công thức nấu ăn thông minh bằng trí tuệ nhân tạo.
          </p>
        </motion.div>

        {/* BENTO GRID DASHBOARD */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px]"
        >
          {/* 1. THẺ GIỚI THIỆU (To - 2x2) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 relative glass rounded-3xl p-8 overflow-hidden group border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10" />

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <Cpu className="absolute top-6 right-6 w-12 h-12 text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-sm font-semibold mb-4 w-fit">
                <Sparkles className="w-4 h-4" />
                Niên luận cơ sở ngành CT239E
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                Gợi ý bữa ăn hoàn hảo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  chỉ từ một bức ảnh
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Dự án được phát triển nhằm giải quyết bài toán "Hôm nay ăn gì?". Bằng cách ứng dụng mô hình AI nhận diện hình ảnh, hệ thống phân tích các nguyên liệu có sẵn của bạn, kết hợp với các bộ lọc ăn kiêng khắt khe để đưa ra thực đơn tối ưu nhất.
              </p>
            </div>
          </motion.div>

          {/* 2. THẺ TECH: YOLOv8 (Nhỏ vuông - 1x1) */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-400/50 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center group"
          >
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white mb-1">YOLOv8</h3>
            <p className="text-xs text-gray-400">Computer Vision & <br /> Object Detection</p>
          </motion.div>

          {/* 3. THẺ TECH: ReactJS (Nhỏ vuông - 1x1) */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-3xl p-6 border border-cyan-500/20 hover:border-blue-400/50 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center group"
          >
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-1">ReactJS</h3>
            <p className="text-xs text-gray-400">Modern Frontend & <br /> UI/UX Design</p>
          </motion.div>

          {/* 4. THẺ TECH: Python (Nhỏ vuông - 1x1) */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-3xl p-6 border border-cyan-500/20 hover:border-yellow-400/50 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center group"
          >
            <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-7 h-7 text-yellow-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Python API</h3>
            <p className="text-xs text-gray-400">FastAPI Backend & <br /> Model Serving</p>
          </motion.div>

          {/* 5. THẺ TECH: Roboflow/Colab (Nhỏ vuông - 1x1) */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-3xl p-6 border border-cyan-500/20 hover:border-purple-400/50 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center group"
          >
            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Data Tools</h3>
            <p className="text-xs text-gray-400">Roboflow Dataset & <br /> Google Colab</p>
          </motion.div>

          {/* 6. THẺ THÀNH VIÊN 1: PHÚ (Ngang - 2x1) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 glass rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex items-center gap-6 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 group-hover:to-cyan-500/10 transition-colors" />

            {/* Avatar Placeholder */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl rotate-6 opacity-50 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 z-10">
                <span className="text-2xl font-bold text-white">MP</span>
              </div>
            </div>

            <div className="relative z-10 flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-xl font-bold text-white">Phan Mỹ Phú</h3>
                  <p className="text-cyan-400 font-mono text-sm">B2303843</p>
                </div>
                <Github className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors cursor-pointer" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Co-Developer</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Frontend (React)</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Backend (Python)</span>
              </div>
            </div>
          </motion.div>

          {/* 7. THẺ THÀNH VIÊN 2: DŨNG (Ngang - 2x1) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 glass rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex items-center gap-6 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:to-blue-500/10 transition-colors" />

            {/* Avatar Placeholder */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl -rotate-6 opacity-50 group-hover:-rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 z-10">
                <span className="text-2xl font-bold text-white">TD</span>
              </div>
            </div>

            <div className="relative z-10 flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-xl font-bold text-white">Mai Tiến Dũng</h3>
                  <p className="text-blue-400 font-mono text-sm">B2303803</p>
                </div>
                <Github className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors cursor-pointer" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Co-Developer</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Frontend (React)</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Backend (Python)</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </AnimatedPage>
  );
}