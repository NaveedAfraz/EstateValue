import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  shadow?: boolean;
  className?: string;
  children?: React.ReactNode;
  as?: any; // Polymorphic component support
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  shadow = false,
  className = '',
  as: Component = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  const shadowClass = shadow ? (
    variant === 'primary' ? 'shadow-lg shadow-blue-500/30' : 
    variant === 'secondary' ? 'shadow-lg shadow-slate-900/30' : 
    'shadow-lg'
  ) : (variant === 'primary' || variant === 'secondary' ? 'shadow-md' : '');

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <Component 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${shadowClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
