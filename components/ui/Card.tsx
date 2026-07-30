import React from "react";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden ${className}`}>
      {/* Detalle sutil rojo en la esquina superior izquierda clásico de la estética gaming */}
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-red-600" />
      <div className="absolute top-0 left-0 w-[2px] h-8 bg-red-600" />

      {title && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-wide">
          {title}
        </h3>
      )}
      
      <div className="text-zinc-300">
        {children}
      </div>
    </div>
  );
}