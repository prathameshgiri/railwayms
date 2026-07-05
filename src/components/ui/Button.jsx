import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight,
  className = '',
  fullWidth = false,
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all flex items-center gap-2',
  }[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${variantClass} ${sizeClasses[size]} ${fullWidth ? 'w-full justify-center' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className} btn-ripple`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {iconRight && !loading && <span>{iconRight}</span>}
    </motion.button>
  );
}
