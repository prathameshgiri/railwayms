import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Blob 1 - Blue */}
      <motion.div
        className="absolute rounded-full opacity-20"
        style={{
          width: 600, height: 600,
          top: '-10%', left: '-10%',
          background: 'radial-gradient(circle, #60A5FA, #2563EB)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blob 2 - Purple */}
      <motion.div
        className="absolute rounded-full opacity-15"
        style={{
          width: 500, height: 500,
          top: '30%', right: '-8%',
          background: 'radial-gradient(circle, #C084FC, #7C3AED)',
          filter: 'blur(70px)',
        }}
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {/* Blob 3 - Indigo */}
      <motion.div
        className="absolute rounded-full opacity-10"
        style={{
          width: 400, height: 400,
          bottom: '5%', left: '30%',
          background: 'radial-gradient(circle, #818CF8, #4F46E5)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 40, -60, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      {/* Blob 4 - Pink */}
      <motion.div
        className="absolute rounded-full opacity-10"
        style={{
          width: 300, height: 300,
          top: '60%', left: '10%',
          background: 'radial-gradient(circle, #F0ABFC, #A855F7)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 70, -20, 0],
          y: [0, -30, 50, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      />
    </div>
  );
}
