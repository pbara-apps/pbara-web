"use client";

import Image from "next/image";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ArrowLink, Eyebrow } from "@/components/site/primitives";

export const RA_TIERS = [
  {
    ages: "10–12",
    name: "Junior RA",
    focus: "Foundational Christian education",
  },
  {
    ages: "13–16",
    name: "Intermediate RA",
    focus: "Basic discipleship for secondary-school age boys",
  },
  {
    ages: "17–24",
    name: "Senior RA",
    focus: "Solid mission education and mission action",
  },
];

export function IdentitySection() {
  return (
    <section className="section-y bg-white max-md:pt-0" aria-labelledby="identity-heading">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 md:order-none lg:col-span-6 lg:pr-8">
            <Reveal>
              <Eyebrow index="01">Who we are</Eyebrow>
              <h2
                id="identity-heading"
                className="display-md mt-6 text-balance text-ink"
              >
                A Baptist missionary organisation for boys — found wherever
                there are Baptists.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-6 space-y-5 text-[16px] leading-relaxed text-text-muted md:mt-8 md:text-[17px]">
              <p>
                Royal Ambassadors is a worldwide Baptist missionary organisation
                for boys between the ages of 10 and 24, present across Africa,
                Asia, Australia, Europe, North America and South America.
              </p>
              <p className="hidden md:block">
                In Nigeria it is the Royal Ambassadors of Nigeria (RAN). Within
                the Pentecost Baptist Association, our chapters walk with boys
                through every stage of their growth — in faith, discipline and
                character.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8">
              <ArrowLink href="/about">Read our full story</ArrowLink>
            </Reveal>
          </div>

          <div className="relative order-1 -mx-5 self-start sm:-mx-8 md:order-none md:mx-0 lg:col-span-6">
            <ImageReveal className="aspect-[5/4] bg-mist md:aspect-[4/3] md:rounded-xl lg:aspect-[5/4]">
              <Image
                src="/images/ra-auxiliary.jpg"
                alt="Royal Ambassadors and auxiliary members gathered with their banner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </ImageReveal>
            <ImageReveal
              delay={0.25}
              className="absolute -bottom-9 right-5 aspect-[4/3] w-[42%] rounded-lg border-[5px] border-white bg-mist shadow-[0_30px_60px_-25px_rgba(5,6,31,0.45)] sm:right-8 md:-bottom-10 md:-left-4 md:right-auto md:w-[44%] md:border-[6px] lg:-left-12"
            >
              <Image
                src="/images/image1.jpeg"
                alt="Ambassadors in uniform at an association ceremony"
                fill
                sizes="300px"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        </div>

        {/* Age pathway */}
        <div className="mt-14 md:mt-32">
          <Reveal className="flex flex-col justify-between gap-2 border-b border-line pb-5 md:flex-row md:items-end md:gap-4 md:pb-6">
            <h3 className="heading-sm text-ink">A pathway for every stage</h3>
            <p className="max-w-md text-[14px] text-text-muted md:text-[15px]">
              RAN&apos;s mission education and ministry plan follows boys from
              their first steps of faith into mission-ready young men.
            </p>
          </Reveal>
          <Stagger as="ol" className="grid md:grid-cols-3">
            {RA_TIERS.map((t, i) => (
              <StaggerItem
                as="li"
                key={t.name}
                className={`group relative grid grid-cols-[6.5rem_1fr] items-center gap-4 border-b border-line py-5 md:block md:border-b-0 md:px-8 md:py-12 ${
                  i === 0 ? "md:pl-0" : "md:border-l"
                }`}
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold md:text-[11px]">
                    Ages
                  </p>
                  <p className="mt-1 font-heading text-[2.1rem] font-extrabold leading-none tracking-[-0.05em] text-ink transition-colors duration-500 group-hover:text-primary md:mt-2 md:text-[clamp(3rem,5.5vw,4.75rem)]">
                    {t.ages}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[16px] font-bold text-ink md:mt-6 md:text-lg">{t.name}</p>
                  <p className="mt-0.5 text-[14px] leading-snug text-text-muted md:mt-1.5 md:text-[15px]">{t.focus}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
