// src/components/ui/SectionTitle.tsx

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  center = true,
}: SectionTitleProps) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {/* Decorative line trên */}
      <div
        className={`flex items-center gap-3 mb-3 ${center ? "justify-center" : ""}`}
      >
        <div className="h-px w-12 bg-primary" />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z"
            fill="#c9a047"
          />
        </svg>
        <div className="h-px w-12 bg-primary" />
      </div>

      {/* Title */}
      <h2
        className="text-2xl md:text-3xl font-bold text-dark uppercase tracking-wider"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>

      {/* Decorative line dưới */}
      <div
        className={`flex items-center gap-3 mt-3 ${center ? "justify-center" : ""}`}
      >
        <div className="h-px w-16 bg-border" />
        <div className="w-2 h-2 rotate-45 bg-primary" />
        <div className="h-px w-16 bg-border" />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-4 text-sm text-muted max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
