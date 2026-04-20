// src/components/ui/Badge.tsx

type BadgeType = "new" | "hot" | "sale" | "out";

interface BadgeProps {
  type: BadgeType;
}

export default function Badge({ type }: BadgeProps) {
  const config: Record<BadgeType, { label: string; class: string }> = {
    new: { label: "MỚI", class: "bg-green-500 text-white" },
    hot: { label: "HOT", class: "bg-red-500 text-white" },
    sale: { label: "SALE", class: "bg-(--color-price) text-white" },
    out: { label: "HẾT", class: "bg-gray-400 text-white" },
  };

  const { label, class: cls } = config[type];

  return (
    <span
      className={`
      absolute top-3 left-3 z-10
      text-xs font-bold px-2 py-1
      tracking-wider
      ${cls}
    `}
    >
      {label}
    </span>
  );
}
