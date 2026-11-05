"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { registrationPath } from "@/lib/api/program";
import { previewText } from "@/lib/format";
import type { RegistrationProgram } from "@/types";

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDeadline(deadline?: string | null) {
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

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[box-shadow,transform] duration-500 ease-brand hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(5,6,31,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-primary">
        {program.flyerImageUrl ? (
          <Image
            src={program.flyerImageUrl}
            alt={`${program.title} flyer`}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-brand group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/ra-logo.png"
              alt=""
              width={96}
              height={96}
              className="rounded-full opacity-90"
            />
          </div>
        )}
        <span className="eyebrow absolute left-4 top-4 rounded-full bg-gold px-3 py-1.5 text-ink">
          {program.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="mb-6 font-heading text-xl font-bold leading-snug tracking-[-0.02em] text-ink">
          <Link href={href} className="after:absolute after:inset-0">
            {program.title}
          </Link>
        </h3>

        {program.description ? (
          <p className="-mt-3 mb-6 line-clamp-3 text-[15px] leading-relaxed text-text-muted">
            {previewText(program.description)}
          </p>
        ) : null}

        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <dt className="eyebrow text-text-muted">Fee</dt>
            <dd className="mt-1 font-semibold text-ink">
              {formatAmount(program.amount)}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-text-muted">Closes</dt>
            <dd className="mt-1 font-semibold text-ink">
              {deadline ?? "Open"}
            </dd>
          </div>
        </dl>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          Register now
          <FiArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </article>
  );
}
