"use client";

import { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiSend } from "react-icons/fi";
import { Button } from "@heroui/react";
import type { FormEvent } from "react";

const subjectOptions = [
  "Membership Inquiry",
  "Chapter Registration",
  "General Inquiry",
  "Media Request",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-dark">
          Contact Our Headquarters
        </h1>
        <p className="text-text-muted mt-2 max-w-2xl">
          Connect with the Royal Ambassadors leadership. Whether you&apos;re a
          counselor, a parent, or an interested youth, we&apos;re here to guide
          you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact form */}
        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Send a message
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-text-dark mb-1"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-text-dark mb-1"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-dark mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-dark mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gold focus:border-gold outline-none bg-white"
                required
              >
                {subjectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-dark mb-1"
              >
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we assist you today?"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gold focus:border-gold outline-none resize-y"
                required
              />
            </div>
            {submitted ? (
              <p className="text-gold font-medium">
                Thank you. Your message has been sent.
              </p>
            ) : (
              <Button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-6 flex items-center justify-center gap-2"
              >
                <FiSend size={18} className="shrink-0" /> Send Message →
              </Button>
            )}
          </form>
        </section>

        {/* Right: Contact info + map */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl border p-6 flex gap-4">
            <div className="bg-gray-200 rounded-lg p-2 w-12 h-12 flex items-center justify-center">
              <FiPhone
                size={28}
                className="text-primary shrink-0"
                aria-hidden
              />
            </div>
            <div>
              <h3 className="font-heading font-bold text-text-dark">Call Us</h3>
              <p className="text-text-muted text-sm mt-1">
                <a href="tel:+2348012345678" className="hover:text-gold">
                  +234 (0) 801 234 5678
                </a>
                <br />
                <a href="tel:+2349012345678" className="hover:text-gold">
                  +234 (0) 901 234 5678
                </a>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6 flex gap-4">
            <div className="bg-gray-200 rounded-lg p-2 w-12 h-12 flex items-center justify-center">
              <FiMail size={28} className="text-primary shrink-0" aria-hidden />
            </div>
            <div>
              <h3 className="font-heading font-bold text-text-dark">
                Email Us
              </h3>
              <p className="text-text-muted text-sm mt-1">
                <a
                  href="mailto:pbara2024@gmail.com"
                  className="hover:text-gold"
                >
                  pbara2024@gmail.com
                </a>
                <br />
                <a href="mailto:admin@pba-ra.org" className="hover:text-gold">
                  admin@pba-ra.org
                </a>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-heading font-bold text-text-dark">
              Follow Our Mission
            </h3>
            <div className="flex gap-3 mt-3" aria-label="Social media">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-primary text-white flex items-center justify-center hover:bg-gold hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-primary text-white flex items-center justify-center hover:bg-gold hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-primary text-white flex items-center justify-center hover:bg-gold hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center text-text-muted">
            <span className="flex items-center gap-2">
              <FiMapPin size={18} /> View Map
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
