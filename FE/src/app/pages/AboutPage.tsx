import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { BrainCircuit, Code2, Database, ScanFace, Activity } from "lucide-react";
import { AnimatedPage, staggerContainer, fadeInUp } from "../components/AnimatedPage";

export function AboutPage() {
  return (
    <ReactLenis root>
      <AnimatedPage>
        <div className="min-h-screen bg-[#000000] text-white pb-32">
          <div className="max-w-5xl mx-auto px-6 pt-24">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Smart Chef.</h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
                Dự án Niên luận Cơ sở ngành CT239E. Ứng dụng AI vào việc nhận diện hình ảnh nguyên liệu và tổng hợp công thức nấu ăn.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Về Công nghệ */}
              <motion.div variants={fadeInUp} className="bg-white/[0.02] rounded-3xl p-10 border border-white/5">
                <BrainCircuit className="w-10 h-10 text-white mb-6" />
                <h2 className="text-2xl font-bold mb-4">Core Technology</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  Hệ thống sử dụng mô hình học sâu (Deep Learning) để phân tích đặc trưng hình ảnh. Kết hợp cùng thuật toán lọc nội suy để đưa ra gợi ý bữa ăn hoàn chỉnh.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm font-medium text-zinc-300"><Activity className="w-5 h-5 text-zinc-500" /> YOLOv8 Model</div>
                  <div className="flex items-center gap-4 text-sm font-medium text-zinc-300"><Code2 className="w-5 h-5 text-zinc-500" /> ReactJS & Tailwind</div>
                  <div className="flex items-center gap-4 text-sm font-medium text-zinc-300"><Database className="w-5 h-5 text-zinc-500" /> FastAPI & MongoDB</div>
                </div>
              </motion.div>

              {/* Về Nhóm */}
              <motion.div variants={fadeInUp} className="bg-white/[0.02] rounded-3xl p-10 border border-white/5 flex flex-col">
                <ScanFace className="w-10 h-10 text-white mb-6" />
                <h2 className="text-2xl font-bold mb-8">Đội ngũ phát triển</h2>
                
                <div className="space-y-8 flex-1">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl shrink-0">MP</div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Phan Mỹ Phú</h4>
                      <p className="text-zinc-500 text-sm">B2303843 · Fullstack Developer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xl shrink-0">TD</div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Mai Tiến Dũng</h4>
                      <p className="text-zinc-500 text-sm">B2303803 · Fullstack Developer</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </AnimatedPage>
    </ReactLenis>
  );
}