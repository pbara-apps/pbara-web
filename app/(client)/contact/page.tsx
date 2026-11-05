"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCheckCircle, FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { Spinner } from "@heroui/react";
import { org_email } from "@/data/contact";
import { Breadcrumbs } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/motion";
import { SocialLinks, hasSocialLinks } from "@/components/site/SocialLinks";
import type { FormEvent } from "react";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useSubmitContactMessage } from "@/service/apis/message";

const subjectOptions = [
  "Membership Inquiry",
  "Chapter Registration",
  "General Inquiry",
  "Media Request",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [message, setMessage] = useState("");
  const submitMessage = useSubmitContactMessage();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await submitMessage.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject,
        message: message.trim(),
      });
      setSubmitted(true);
      successToast("Your message has been sent. We will get back to you soon.");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ??
          "Unable to send your message. Please try again.",
        "Send failed",
      );
    }
  }

  return (
    <div className="bg-ivory">
      <div className="container-site pt-12 md:pt-16">
        <Breadcrumbs items={[{ label: "Contact" }]} />
      </div>

      <div className="container-site grid gap-6 pb-24 pt-10 md:pb-32 md:pt-14 lg:grid-cols-12 lg:gap-8">
        {/* Info panel */}
        <aside className="grain relative overflow-hidden rounded-2xl bg-ink p-8 text-white md:p-12 lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-gold">Contact the secretariat</p>
            <h1 className="display-lg mt-6 text-balance">
              Let&apos;s talk.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Whether you&apos;re a counsellor, a parent, or an interested
              youth, the Royal Ambassadors leadership is here to guide you.
            </p>
          </Reveal>

          <dl className="mt-24 space-y-8 border-t border-white/10 pt-10">
            <div>
              <dt className="eyebrow text-white/45">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${org_email}`}
                  className="group inline-flex items-center gap-2 text-xl font-semibold text-white transition-colors hover:text-gold"
                >
                  <FiMail className="h-5 w-5 text-gold" aria-hidden />
                  {org_email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-white/45">Location</dt>
              <dd className="mt-2 flex items-center gap-2 text-xl font-semibold">
                <FiMapPin className="h-5 w-5 text-gold" aria-hidden />
                Lagos, Nigeria
              </dd>
            </div>
            {hasSocialLinks ? (
              <div>
                <dt className="eyebrow text-white/45">Follow our mission</dt>
                <dd className="mt-3">
                  <SocialLinks />
                </dd>
              </div>
            ) : null}
            
          </dl>
        </aside>

        {/* Form */}
        <section aria-labelledby="form-heading" className="rounded-2xl bg-white p-8 ring-1 ring-line md:p-12 lg:col-span-7">
          <h2 id="form-heading" className="heading-sm text-ink">
            Send a message
          </h2>
          <p className="mt-2 text-[15px] text-text-muted">
            Fill in the form and the secretariat will get back to you.
          </p>

          {submitted ? (
            <div className="mt-10 flex flex-col items-start gap-4 rounded-xl bg-ivory p-8">
              <FiCheckCircle className="h-8 w-8 text-gold" aria-hidden />
              <p className="text-xl font-bold text-ink">Thank you. Your message has been sent.</p>
              <p className="text-text-muted">
                We&apos;ll reply to <span className="font-semibold text-ink">{email}</span> as soon as we can.
              </p>
              <Link href="/" className="btn btn-navy group mt-2">
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="field-label">First name</label>
                  <input id="first-name" type="text" autoComplete="given-name" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="field" required />
                </div>
                <div>
                  <label htmlFor="last-name" className="field-label">Last name</label>
                  <input id="last-name" type="text" autoComplete="family-name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="field" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="field-label">Email address</label>
                  <input id="email" type="email" autoComplete="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
                </div>
                <div>
                  <label htmlFor="phone" className="field-label">
                    Phone <span className="font-normal text-text-muted">(optional)</span>
                  </label>
                  <input id="phone" type="tel" autoComplete="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" />
                </div>
              </div>
              <fieldset>
                <legend className="field-label">Subject</legend>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((opt) => (
                    <label
                      key={opt}
                      className="cursor-pointer rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:border-ink hover:text-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold"
                    >
                      <input
                        type="radio"
                        name="subject"
                        value={opt}
                        checked={subject === opt}
                        onChange={() => setSubject(opt)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="message" className="field-label">Your message</label>
                <textarea id="message" rows={6} placeholder="How can we assist you today?" value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" required />
              </div>
              <button type="submit" disabled={submitMessage.isPending} className="btn btn-navy group w-full sm:w-auto">
                {submitMessage.isPending ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <FiSend className="h-4 w-4" aria-hidden />
                )}
                {submitMessage.isPending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
