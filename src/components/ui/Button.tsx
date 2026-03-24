import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variantClasses = {
  gold: "bg-gold text-background hover:bg-gold-light",
  outline: "border border-gold text-gold hover:bg-gold hover:text-background",
  ghost: "text-text-muted hover:text-text",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs tracking-[0.08em]",
  md: "px-6 py-3 text-sm tracking-[0.08em]",
  lg: "px-8 py-4 text-base tracking-[0.08em]",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "gold",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-medium transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
