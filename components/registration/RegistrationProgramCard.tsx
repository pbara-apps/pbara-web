"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCalendar, FiCreditCard } from "react-icons/fi";
import { registrationPath } from "@/lib/api/program";
import type { RegistrationProgram } from "@/types";

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDeadline(deadline?: string | null) {
  if (!deadline) return null;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface RegistrationProgramCardProps {
  program: RegistrationProgram;
}

export function RegistrationProgramCard({
  program,
}: RegistrationProgramCardProps) {
  const href = registrationPath(program.slug);
  const deadline = formatDeadline(program.registrationDeadline);
  const imageSrc = program.flyerImageUrl || "/images/ra-logo.png";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block h-48 overflow-hidden bg-primary/10">
        <Image
          src={imageSrc}
          alt={program.flyerImageUrl ? `${program.title} flyer` : program.title}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            program.flyerImageUrl ? "" : "object-contain p-10 opacity-80"
          }`}
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <span className="absolute left-4 top-4 rounded bg-gold px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          {program.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wide text-gold">
          <span className="inline-flex items-center gap-1.5">
            <FiCreditCard size={14} aria-hidden />
            {formatAmount(program.amount)}
          </span>
          {deadline ? (
            <span className="inline-flex items-center gap-1.5 text-text-muted">
              <FiCalendar size={14} aria-hidden />
              Closes {deadline}
            </span>
          ) : (
            <span className="text-text-muted">Open registration</span>
          )}
        </div>

        <h3 className="font-heading text-xl font-black leading-tight text-primary transition-colors group-hover:text-gold">
          <Link href={href}>{program.title}</Link>
        </h3>

        {program.description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted line-clamp-3">
            {program.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <Link
          href={href}
          className="mt-6 inline-flex min-h-[44px] touch-manipulation items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3"
        >
          Register now
          <FiArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
