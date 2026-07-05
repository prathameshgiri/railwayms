export default function Badge({ children, variant = 'blue', className = '' }) {
  const variants = {
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    slate: 'bg-slate-100 text-slate-600',
    gold: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`badge ${variants[variant] || variants.blue} ${className}`}>
      {children}
    </span>
  );
}
