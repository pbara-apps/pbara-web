import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { MdFormatQuote } from "react-icons/md";

type DirectorDeskData = {
  name: string;
  title: string;
  description: string;
  image?: string | null;
};

/**
 * Full-width card: left — director photo placeholder + name overlay; right — quote marks, heading, message, read more link
 */
export function DirectorDesk({ data }: { data: DirectorDeskData }) {
  const directorPortraitSrc = data.image || "/images/ik.png";

  return (
    <section className="py-20 bg-background" aria-labelledby="director-heading">
      <div className="max-w-7xl mx-auto px-6">
        <article className="bg-surface rounded-xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
          {/* Left: portrait block */}
          <div className="md:w-1/3 relative min-h-[400px]">
            <div className="absolute inset-0 bg-primary/20 z-10" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Portrait of the Association Director"
              src={directorPortraitSrc}
              className="absolute inset-0 w-full h-full object-cover bg-[#9bbec4]"
            />

            <div className="absolute bottom-6 left-6 z-20">
              <h4 className="text-white text-xl font-bold">{data.name}</h4>
              <p className="text-gold text-sm font-semibold">{data.title}</p>
            </div>
          </div>

          {/* Right: content */}
          <div className="md:w-2/3 p-10 md:p-16 flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <MdFormatQuote size={48} className="text-gold" aria-hidden />
              <h3
                id="director-heading"
                className="font-heading text-3xl font-black text-primary tracking-tight"
              >
                From the Director&apos;s Desk
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {data.description}
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm hover:text-gold transition-colors min-h-[44px] touch-manipulation"
              >
                Read Full Vision Statement
                <FiArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
