"use client";

import Image from "next/image";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Eyebrow } from "@/components/site/primitives";
import { RA_TIERS } from "@/components/sections/IdentitySection";

const TIMELINE = [
  {
    year: "1908",
    title: "A vision begins",
    body: "The vision and work of Royal Ambassadors started in the United States among the Brotherhood Commission of the Southern Baptist Convention.",
  },
  {
    year: "1920s",
    title: "Arrival in Nigeria",
    body: "Royal Ambassadors came to Nigeria through Southern Baptist Convention missionaries, as one of the world's leading organisations for boys.",
  },
  {
    year: "1954",
    title: "Men take up the boys' work",
    body: "The Women's Missionary Union sponsored the organisation from the beginning until 1954, when it was proposed that the men of the Nigerian Baptist Convention take over the boys' work.",
  },
  {
    year: "1961",
    title: "Men and Boys Department",
    body: "A Men and Boys department was proposed to serve both men and boys. It later became the Men's Missionary Union and Youth department.",
  },
  {
    year: "1998",
    title: "Missionary Organisations Department",
    body: "The work became part of what is now known as the Missionary Organisations Department.",
  },
  {
    year: "Today",
    title: "In every association",
    body: "To the glory of God, RAN now exists in all Baptist associations, conferences and the convention, and is spreading its mission into the West African sub-region.",
  },
];

// Official order, from the RA "Vision, Goals & Cardinal Objectives" document.
const OBJECTIVES = [
  "Helping boys in personal spiritual development and discipleship.",
  "Equipping members for mission action.",
  "Ensuring educational and career development of boys.",
  "Promoting social awareness, responsibility and responsiveness.",
  "Promoting personal and corporate discipline and cohesion.",
  "Promoting personal commitment demonstrated in stewardship of life, churchmanship and denominational interest, and understanding as well as appreciation of Baptist beliefs and practices.",
  "Enabling members' personality, potentiality and dignity development.",
];

// The RA pledge — its five lines are also the organisation's founding goals.
const PLEDGE = [
  "To become a well-informed, responsible follower of Christ;",
  "To have a Christ-like concern for all people;",
  "To carry the message of Christ around the world;",
  "To work with others in sharing Christ; and",
  "To keep myself clean and healthy in mind and body.",
];

export function AboutIntro() {
  return (
    <section className="section-y bg-white" aria-labelledby="about-intro-heading">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="01">Who we are</Eyebrow>
          </Reveal>
          <div className="lg:col-span-8">
            <Reveal>
              <h2
                id="about-intro-heading"
                className="font-heading text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.2] tracking-[-0.03em] text-ink text-pretty"
              >
                Royal Ambassadors is a worldwide Baptist missionary organisation
                for boys between the ages of 10 and 24 — found wherever there
                are Baptists, on six continents.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 grid gap-8 text-[17px] leading-relaxed text-text-muted md:grid-cols-2">
              <p>
                The organisation in Nigeria is called the Royal Ambassadors of
                Nigeria (RAN). The Pentecost Baptist Association Royal
                Ambassadors carry that work into our local churches and
                chapters.
              </p>
              <p>
                In its mission education and ministry plan, RAN provides a
                learning path for every age — from foundational Christian
                education for juniors to solid mission education and action for
                seniors.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-12">
          <ImageReveal className="aspect-[4/3] rounded-xl bg-mist md:col-span-7 md:aspect-auto md:min-h-[28rem]">
            <Image
              src="/images/image1.jpeg"
              alt="Royal Ambassadors and auxiliary members at a church ceremony"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </ImageReveal>
          <Stagger as="ol" className="flex flex-col gap-5 md:col-span-5">
            {RA_TIERS.map((t) => (
              <StaggerItem
                as="li"
                key={t.name}
                className="flex flex-1 items-end justify-between gap-6 rounded-xl bg-ivory p-7"
              >
                <div>
                  <p className="text-lg font-bold text-ink">{t.name}</p>
                  <p className="mt-1 text-sm text-text-muted">{t.focus}</p>
                </div>
                <p className="shrink-0 font-heading text-4xl font-extrabold tracking-[-0.05em] text-primary">
                  {t.ages}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function AboutHistory() {
  return (
    <section id="history" className="section-y bg-ivory" aria-labelledby="history-heading">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow index="02">Our heritage</Eyebrow>
                <h2 id="history-heading" className="display-md mt-6 text-balance text-ink">
                  More than a century of raising boys for Christ.
                </h2>
                <p className="mt-6 text-[16px] leading-relaxed text-text-muted">
                  The Royal Ambassadors National Executive Committee (RANEC)
                  comprises all elected national officers, while the National
                  Executive Council (NEC) includes all Conference RA Directors.
                  The RA Marshal presides over all meetings, and the council
                  cooperates with the MMU NEC through a designated RA Council
                  Adviser, operating from the MMU office, Baptist Building,
                  Ibadan.
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="relative lg:col-span-8">
            <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-[9.5rem]" />
            {TIMELINE.map((item, i) => (
              <Reveal
                as="li"
                key={item.year}
                delay={i * 0.04}
                className="relative grid gap-3 pb-12 pl-10 last:pb-0 md:grid-cols-[8rem_1fr] md:gap-12 md:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-[3px] border-ivory bg-gold ring-1 ring-gold md:left-[9.5rem] md:-translate-x-[7px]"
                />
                <p className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-primary md:text-right">
                  {item.year}
                </p>
                <div className="md:pl-8">
                  <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-text-muted">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function AboutObjectives() {
  return (
    <section id="objectives" className="section-y bg-white" aria-labelledby="objectives-heading">
      <div className="container-site">
        <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow index="05">What we work towards</Eyebrow>
            <h2 id="objectives-heading" className="display-lg mt-6 text-ink">
              Seven cardinal objectives
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-text-muted">
              Every program, camp and chapter meeting is shaped by these seven
              aims of the Royal Ambassadors of Nigeria.
            </p>
          </Reveal>
        </div>

        <Stagger as="ol" className="grid md:grid-cols-2">
          {OBJECTIVES.map((text, i) => (
            <StaggerItem
              as="li"
              key={text}
              className={`group flex gap-6 border-b border-line py-8 md:py-10 ${
                i % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"
              } ${i === OBJECTIVES.length - 1 ? "md:col-span-2 md:border-l-0 md:pl-0" : ""}`}
            >
              <span className="w-16 shrink-0 font-heading text-5xl font-extrabold leading-none tracking-[-0.05em] text-gold/70 transition-colors duration-500 group-hover:text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 text-lg font-semibold leading-snug text-ink md:text-xl">
                {text}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function AboutPhilosophy() {
  return (
    <section id="philosophy" className="section-y bg-ivory" aria-labelledby="philosophy-heading">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow index="04">Our King&apos;s command</Eyebrow>
            <h2 id="philosophy-heading" className="sr-only">
              Our philosophy
            </h2>
            <figure className="mt-8">
              <blockquote className="font-heading text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.2] tracking-[-0.03em] text-ink text-pretty">
                <span className="text-gold">“</span>Therefore go and make
                disciples of all nations, baptizing them in the name of the
                Father and of the Son and of the Holy Spirit, and teaching them
                to obey everything I have commanded you. And surely I am with
                you always, to the very end of the age.
                <span className="text-gold">”</span>
              </blockquote>
              <figcaption className="eyebrow mt-6 text-text-muted">
                <span className="text-gold">Matthew 28:19–20</span> · NIV
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pt-16">
            <p className="eyebrow text-gold">Our philosophy</p>
            <div className="mt-5 space-y-5 text-[17px] leading-relaxed text-text-muted">
              <p>
                The foundation, vision and ministries of RAN are responses to
                the Lord&apos;s command to make disciples of{" "}
                <span className="font-semibold text-ink">all</span> nations.
              </p>
              <p>
                We minister to boys because it is easier to catch them young.
                Today&apos;s boys are the men of tomorrow — the ones who will
                carry the social and spiritual responsibility of leading
                families, communities and nations. They must not be left in
                the wrong hands.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AboutPledge() {
  return (
    <section id="pledge" className="grain relative overflow-hidden bg-ink text-white" aria-labelledby="pledge-heading">
      <div className="container-site section-y relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="06" tone="dark">
              The Royal Ambassador Pledge
            </Eyebrow>
            <h2 id="pledge-heading" className="display-md mt-6 text-balance">
              As a Royal Ambassador I will do my best:
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">
              Every ambassador makes this pledge. Its five commitments are also
              the founding goals of the Royal Ambassadors.
            </p>
          </Reveal>

          <Stagger as="ol" className="lg:col-span-8">
            {PLEDGE.map((line, i) => (
              <StaggerItem
                as="li"
                key={line}
                className="group flex items-baseline gap-6 border-t border-white/10 py-7 last:border-b md:gap-10"
              >
                <span className="w-10 shrink-0 font-mono text-[12px] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-[clamp(1.375rem,2.4vw,2rem)] font-bold leading-snug tracking-[-0.025em] transition-colors duration-500 group-hover:text-gold">
                  {line}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
