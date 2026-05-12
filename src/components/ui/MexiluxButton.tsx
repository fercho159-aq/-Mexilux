import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3 text-base",
  lg: "px-9 py-4 text-lg",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-white text-[#152132] border border-[#152132] hover:bg-[#152132] hover:text-white",
  secondary:
    "bg-transparent text-white border border-white hover:bg-white hover:text-[#152132]",
  ghost:
    "bg-transparent text-[#152132] border border-transparent hover:bg-[#152132]/10",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#8A6623] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  borderRadius: "9999px",
  fontWeight: 500,
  textDecoration: "none",
  transition: "all 200ms",
  cursor: "pointer",
  textAlign: "center",
};

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { padding: "0.5rem 1.25rem", fontSize: "0.875rem" },
  md: { padding: "0.75rem 1.75rem", fontSize: "1rem" },
  lg: { padding: "1rem 2.25rem", fontSize: "1.125rem" },
};

export function buttonStyle(
  size: Size = "md",
  extra?: CSSProperties
): CSSProperties {
  return { ...baseStyle, ...sizeStyles[size], ...extra };
}

export function buttonClassNames({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: Pick<BaseProps, "variant" | "size" | "fullWidth" | "className"> = {}) {
  return [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {}

export function MexiluxButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClassNames({ variant, size, fullWidth, className })}
      style={buttonStyle(size, style)}
      {...rest}
    >
      {children}
    </button>
  );
}

interface LinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  style?: React.CSSProperties;
}

export function MexiluxButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  href,
  target,
  rel,
  prefetch,
  style,
  children,
}: LinkProps) {
  const computedRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel;
  const isExternal = href.startsWith("http") || target === "_blank";
  const computedStyle = buttonStyle(size, style);

  if (isExternal) {
    return (
      <a
        href={href}
        target={target}
        rel={computedRel}
        className={buttonClassNames({ variant, size, fullWidth, className })}
        style={computedStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={buttonClassNames({ variant, size, fullWidth, className })}
      style={computedStyle}
    >
      {children}
    </Link>
  );
}
