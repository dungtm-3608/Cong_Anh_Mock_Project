import type { ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "dark" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  // ── Base styles ──
  const base = `
    inline-flex items-center justify-center gap-2
    font-body font-semibold tracking-widest uppercase
    transition-all duration-200 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // ── Variants ──
  const variants: Record<ButtonVariant, string> = {
    primary: `
      bg-(--color-primary) text-white
      border border-(--color-primary)
      hover:bg-(--color-primary-hover)
      hover:border-(--color-primary-hover)
      active:scale-95
    `,
    outline: `
      bg-transparent text-(--color-primary)
      border border-(--color-primary)
      hover:bg-(--color-primary) hover:text-white
      active:scale-95
    `,
    dark: `
      bg-(--color-dark) text-white
      border border-(--color-dark)
      hover:bg-(--color-dark-2)
      active:scale-95
    `,
    ghost: `
      bg-transparent text-(--color-primary)
      border border-transparent
      hover:text-(--color-primary-hover)
      underline-offset-4 hover:underline
    `,
  };

  // ── Sizes ──
  const sizes: Record<ButtonSize, string> = {
    sm: "text-xs px-4 py-2",
    md: "text-xs px-6 py-3",
    lg: "text-sm px-8 py-4",
  };

  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
