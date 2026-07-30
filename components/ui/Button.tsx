import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-xl font-bold transition-all duration-300";

  const styles = {
    primary:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/30",

    secondary:
      "border border-red-600 text-red-500 hover:bg-red-600 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}