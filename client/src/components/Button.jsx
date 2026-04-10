import React from "react";

const variantStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-slate-700 hover:bg-slate-800 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  purple: "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white",
  outline: "border border-slate-600 text-slate-900 bg-white hover:bg-slate-100",
  ghost: "bg-transparent text-white hover:bg-white/10",
};

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}) => {
  const classes = [
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

export default Button;
