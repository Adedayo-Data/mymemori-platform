import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-hanken font-semibold cursor-pointer transition-all inline-flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary: 'btn-glass-glow text-white tracking-wider',
    secondary: 'border border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
    ghost: 'text-white/70 hover:text-white',
    gradient: 'bg-gradient-to-r from-primary-container to-secondary-container text-white font-sora shadow-lg shadow-primary-container/20 hover:shadow-primary-container/40 scale-95 active:scale-90 hover:scale-100',
  };

  const sizes = {
    sm: 'text-[12px] px-[18px] py-[8px] rounded-xl',
    md: 'text-[13px] px-[22px] py-[10px] rounded-xl',
    lg: 'text-[14px] px-8 py-4 rounded-2xl tracking-widest uppercase',
    xl: 'text-xl py-3 px-6 rounded-lg font-sora',
  };

  const getVariantStyles = () => {
    if (variant === 'ghost') return variants.ghost;
    return `${variants[variant]} ${sizes[size]}`;
  };

  return (
    <button
      className={`${baseStyles} ${getVariantStyles()} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[1.2em] group-hover:-translate-x-1 transition-transform">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[1.2em] group-hover:translate-x-1 transition-transform">{icon}</span>
      )}
    </button>
  );
};
