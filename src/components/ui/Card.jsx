import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick, padding = true }) {
  return (
    <motion.div
      onClick={onClick}
      className={`glass shadow-soft ${padding ? 'p-6' : ''} ${hover ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
