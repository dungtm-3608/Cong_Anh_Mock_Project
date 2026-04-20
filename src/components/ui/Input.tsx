import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-xs font-semibold tracking-widest uppercase text-(--color-dark) mb-2">
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`
            w-full border border-(--color-border)
            bg-white text-(--color-dark)
            text-sm px-4 py-3
            outline-none
            transition-all duration-200
            placeholder:text-(--color-muted)
            focus:border-(--color-primary)
            ${error ? "border-red-500 focus:border-red-500" : ""}
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${className}
          `}
            {...rest}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted)">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
