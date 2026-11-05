"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Eyebrow } from "@/components/site/primitives";

const PILLARS = [
  {
    title: "Faith",
    body: "Personal spiritual development and discipleship, rooted in the Word of God.",
  },
  {
    title: "Discipline",
    body: "Personal and corporate discipline and cohesion, learnt through drill and order.",
  },
  {
    title: "Service",
    body: "Equipping members for mission action and responsible, responsive citizenship.",
  },
];

export function MissionBand({
  id,
  index = "02",
}: {
  id?: string;
  index?: string;
}) {
  return (
    <section
      id={id}
      className="grain relative overflow-hidden bg-primary text-white"
      aria-labelledby={`${id ?? "mission"}-heading`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full border border-white/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-[24rem] w-[24rem] rounded-full border border-gold/15"
      />

      <div className="container-site section-y relative">
        <Reveal>
          <Eyebrow index={index} tone="dark">
            Vision &amp; mission
          </Eyebrow>
        </Reveal>

        <div className="mt-10 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <p className="sr-only" id={`${id ?? "mission"}-heading`}>
              Our vision
            </p>
            <blockquote className="display-lg text-balance">
              <span className="text-gold">“</span>Touching the lives of
              boys… impacting the{" "}
              <em className="font-extrabold not-italic text-gold">eternity</em>{" "}
              of men.<span className="text-gold">”</span>
            </blockquote>
            <p className="eyebrow mt-6 text-white/50">Our vision</p>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-4 lg:pt-4">
            <p className="eyebrow text-gold">Our mission</p>
            <p className="mt-4 text-xl leading-relaxed text-white/85 text-pretty">
              To reach, teach, and win young men for Christ, fostering their
              growth through spiritual disciplines, mission activities, and
              character development.
            </p>
          </Reveal>
        </div>

        <Stagger
          as="ul"
          className="mt-20 grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-3"
        >
          {PILLARS.map((p, i) => (
            <StaggerItem
              as="li"
              key={p.title}
              className="group bg-primary p-8 transition-colors duration-500 hover:bg-[#0e1048] md:p-10"
            >
              <span className="font-mono text-[11px] text-gold">0{i + 1}</span>
              <h3 className="mt-10 font-heading text-3xl font-bold tracking-[-0.03em]">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
