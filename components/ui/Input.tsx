import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({
  label,
  type = "text",
  placeholder = "",
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-zinc-400 mb-2 font-medium">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 ${className}`}
        {...props}
      />
    </div>
  );
}