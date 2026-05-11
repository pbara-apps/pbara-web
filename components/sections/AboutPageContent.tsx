"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiCheckSquare, FiEye, FiShield, FiArrowRight } from "react-icons/fi";
import { Button, cn } from "@heroui/react";
import { useState } from "react";

const stats = [
  { value: "12+", label: "Active Chapters" },
  { value: "500+", label: "Total Ambassadors" },
  { value: "25+", label: "Annual Programs" },
];

export function AboutPageContent() {
  const [showMore, setShowMore] = useState(false); // Default to false, meaning show only the first paragraph

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-16">
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10"
        aria-labelledby="heritage-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="w-16 h-1 bg-gold mb-6" aria-hidden />
          <h2
            id="heritage-heading"
            className="font-heading text-3xl mb-6 text-text-dark"
          >
            About Royal Ambassadors of Nigeria
          </h2>
          <p className="text-text-muted leading-relaxed mb-4 text-justify">
            Royal Ambassadors is the name of a Baptist worldwide missionary
            organization for boys between the ages of 10 and 24 – an
            international organization found in many countries of the world,
            wherever there are Baptists. It is found on the continents of
            Africa, Asia, Australia, Europe, North America, and South America.
          </p>
          <p className="text-text-muted leading-relaxed text-justify">
            The organization in Nigeria is Called Royal Ambassadors of
            Nigeria(RAN). In its mission education and ministry plan, RAN has a
            foundational Christian education plans for junior RA, boys between
            the ages 10 and 12; basic discipleship plans for intermediate RA,
            Boys from age 13 to 16 (or secondary school age); and solid mission
            education and action plans for senior RA, who are boys within the
            ages 17 and 24.
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-2xl h-[400px] bg-primary/10">
          <Image
            src="/images/image4.jpg"
            alt="Royal Ambassadors activities and heritage"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 550px"
          />
        </div>
      </motion.section>
      {showMore && (
        <motion.section
          className={cn("mb-24", showMore ? "h-auto" : "h-40 overflow-hidden")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-text-muted leading-relaxed text-justify">
            The vision and work of royal ambassadors started in the united
            states of America in 1908 among the brotherhood commission of the
            southern Baptist convention, USA; and came to Nigeria as one of the
            world’s leading organizations for boys through the SBC missionaries
            in the 1920’s. The women’s missionary Union sponsored the
            organization from the beginning until 1954 when it was proposed that
            the men of the Nigerian Baptist convention should take over the
            boy’s work. The situation that led to the proposal of Men and Boys
            department in 1961 which served both men and boys, then later became
            the defunct Men’s Missionary Union and Youth department, now known
            as Missionary Organizations Department since 1998. Royal Ambassadors
            National Executive Committee (RANEC) comprises of all elected
            national officers of the organization only; while the National
            Executive Council (NEC) includes all Conference RA Directors.
          </p>
          <p className="text-text-muted leading-relaxed text-justify">
            The RA Marshal is the presiding officer in all meetings (of
            executives or general sessions). But the council cooperates with the
            MMU NEC through an advisory representative designated RA council
            Adviser; and operates from the MMU office, Baptist building, Ibadan
            through a denominational/administrative head of the unit. To the
            glory of God, RAN now exist in all Baptist associations ,
            conferences and the convention, and is spreading its missions
            advancement tentacles to the West African sub-regions.
          </p>
        </motion.section>
      )}

      <div className="flex items-center justify-center gap-2">
        <div
          className="w-16 md:w-64 border border-primary rounded-full"
          aria-hidden
        />
        <Button
          radius="full"
          variant="bordered"
          className="text-primary"
          onPress={handleReadMore}
        >
          {showMore ? "Read Less" : "Read More about RAN"}{" "}
          <FiArrowRight size={18} aria-hidden />
        </Button>
        <div
          className="w-16 md:w-64 border border-primary rounded-full"
          aria-hidden
        />
      </div>

      <div
        className="w-full flex items-center justify-center my-16"
        aria-hidden
      >
        <div className="flex-grow border-t border-gold/30" />
        <span className="px-4 text-gold">
          <FiShield size={22} />
        </span>
        <div className="flex-grow border-t border-gold/30" />
      </div>

      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
        aria-labelledby="vision-mission-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="vision-mission-heading" className="sr-only">
          Vision and Mission
        </h2>

        <div className="bg-primary/5 border-l-4 border-primary p-10 rounded-r-xl">
          <div className="text-primary mb-4">
            <FiEye size={28} aria-hidden />
          </div>
          <h3 className="font-heading text-2xl mb-4 text-primary">
            Our Vision
          </h3>
          <p className="text-text-dark text-lg italic">
            Touching the lives of boys... impacting the eternity of men!
          </p>
        </div>

        <div className="bg-gold/10 border-l-4 border-gold p-10 rounded-r-xl">
          <div className="text-gold mb-4">
            <FiCheckSquare size={28} aria-hidden />
          </div>
          <h3 className="font-heading text-2xl mb-4 text-gold">Our Mission</h3>
          <p className="text-text-dark text-lg">
            &quot;To reach, teach, and win young men for Christ, fostering their
            growth through spiritual disciplines, mission activities, and
            character development.&quot;
          </p>
        </div>
      </motion.section>

      <motion.section className="mb-10">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-16 border border-primary rounded-full"
              aria-hidden
            />
            <Button
              radius="full"
              variant="bordered"
              color="primary"
              className="text-primary"
            >
              7 Cardinal Objectives
            </Button>
            <div
              className="w-16 border border-primary rounded-full"
              aria-hidden
            />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="py-6 px-8 rounded-xl bg-primary text-white text-center">
                Helping boys in personal spiritual development and discipleship.
              </div>
              <div className="absolute w-16 h-6 bg-[#f5f6fa] rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
              <div className="py-6 px-8 rounded-xl bg-primary text-white text-center">
                Ensuring educational and career development of boys.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="py-6 px-8 rounded-xl bg-primary text-white text-center">
                Promoting personal and corporate discipline and cohesion.
              </div>
              <div className="absolute w-16 h-6 bg-[#f5f6fa] rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
              <div className="py-6 px-8 rounded-xl bg-primary text-white text-center">
                Enabling members personality, potentiality and dignity
                development.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="py-6 px-8 rounded-xl bg-primary text-white text-center">
                Equipping members for mission action.
              </div>
              <div className="absolute w-16 h-6 bg-[#f5f6fa] rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
              <div className="py-6 px-8 rounded-xl bg-primary text-white text-center">
                Promoting social awareness, responsibility and responsiveness.
              </div>
            </div>

            <div className="flex justify-center items-center mt-6">
              <div className="p-6 rounded-xl bg-primary text-white text-center">
                Promoting personal commitment demonstrated in stewardship of
                life, churchmanship and denominational interest, and
                understanding as well as an appreciation of Baptist beliefs and
                practices.
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mb-24"
        aria-labelledby="overview-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2
            id="overview-heading"
            className="font-heading text-3xl mb-4 text-text-dark"
          >
            Association Overview
          </h2>
          <p className="max-w-2xl mx-auto text-text-muted">
            The Pentecost Baptist Association RA operates under a structured
            hierarchy designed to foster accountability and excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white p-8 rounded-xl shadow-sm border border-primary/10 text-center"
            >
              <span className="text-4xl font-bold text-primary block mb-2 font-heading">
                {value}
              </span>
              <span className="text-sm font-semibold text-text-muted uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* <motion.section
        className="bg-slate-50 rounded-2xl p-12 mb-16"
        aria-labelledby="patrons-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-12">
          <h2
            id="patrons-heading"
            className="font-heading text-4xl mb-4 text-text-dark"
          >
            Our Patrons
          </h2>
          <div className="w-24 h-0.5 bg-gold" aria-hidden />
          <p className="mt-4 text-text-muted text-center max-w-xl italic">
            Dignified elders and leaders providing spiritual guidance and
            support to the association.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {aboutPatrons.map((patron) => {
            const imageSrc = patron.image ?? "/images/ra-logo.png";
            return (
              <div key={patron.id} className="flex flex-col items-center">
                <div className="size-40 rounded-full border-4 border-gold p-1 mb-6 bg-white overflow-hidden">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-primary/10">
                    <Image
                      alt={`${patron.name} — patron`}
                      src={imageSrc}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                </div>
                <h4 className="font-heading text-xl text-text-dark">
                  {patron.name}
                </h4>
                <p className="text-gold font-medium mb-3">{patron.role}</p>
                <p className="text-text-muted text-sm text-center">
                  {patron.description ?? patron.quote}
                </p>
              </div>
            );
          })}
        </div>
      </motion.section> */}

      <div className="pt-2">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm hover:text-gold transition-colors min-h-[44px] touch-manipulation"
        >
          Join the Mission
          <FiArrowRight size={18} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
