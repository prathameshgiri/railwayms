import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  containerClassName = '',
  hint,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={`input-glass ${Icon ? 'pl-10' : ''} ${IconRight ? 'pr-10' : ''} ${error ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''} ${className}`}
          {...props}
        />
        {IconRight && (
          <div className="absolute right-3 text-slate-400">
            <IconRight size={16} />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
