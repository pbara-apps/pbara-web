import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { cn } from "@/lib/cn";

/** Standard page-width wrapper used by every public section. */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cn("container-site", className)}>{children}</Tag>;
}

/**
 * Small mono label above headings, optionally numbered ("01").
 * `tone` adapts colours for dark sections.
 */
export function Eyebrow({
  children,
  index,
  tone = "light",
  className,
}: {
  children: ReactNode;
  index?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "eyebrow flex items-center gap-3",
        tone === "dark" ? "text-white/60" : "text-text-muted",
        className,
      )}
    >
      {index ? (
        <span className="text-gold tabular-nums">{index}</span>
      ) : (
        <span aria-hidden className="h-px w-6 bg-gold" />
      )}
      <span>{children}</span>
    </p>
  );
}

type ButtonVariant =
  | "gold"
  | "navy"
  | "light"
  | "outline"
  | "outline-light";

const variantClass: Record<ButtonVariant, string> = {
  gold: "btn-gold",
  navy: "btn-navy",
  light: "btn-light",
  outline: "btn-outline",
  "outline-light": "btn-outline-light",
};

/** Pill link-button with a sliding arrow. Internal links use next/link. */
export function ButtonLink({
  href,
  variant = "gold",
  children,
  className,
  arrow = true,
  external = false,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const content = (
    <>
      <span>{children}</span>
      {arrow ? (
        external ? (
          <FiArrowUpRight className="btn-arrow h-4 w-4" aria-hidden />
        ) : (
          <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
        )
      ) : null}
    </>
  );
  const classes = cn("btn group", variantClass[variant], className);

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

/** Inline text link with animated underline + arrow. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-ink",
        className,
      )}
    >
      <span className="link-underline">{children}</span>
      <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
    </Link>
  );
}
