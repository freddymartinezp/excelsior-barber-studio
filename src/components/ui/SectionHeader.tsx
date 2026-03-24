interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} gap-3 ${className}`}>
      {eyebrow && (
        <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium">{eyebrow}</p>
      )}
      <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-light text-text leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-text-muted max-w-xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
