type BadgeProps = {
  children: React.ReactNode;
  color?: "red" | "green" | "yellow";
};

export default function Badge({
  children,
  color = "red",
}: BadgeProps) {
  const colors = {
    red: "bg-red-600/20 text-red-500",
    green: "bg-green-600/20 text-green-400",
    yellow: "bg-yellow-600/20 text-yellow-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}