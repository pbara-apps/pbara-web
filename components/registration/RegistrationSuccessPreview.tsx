"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FiArrowRight, FiCheckCircle, FiDownload } from "react-icons/fi";
import { fadeInUp, motionSafe, mountProps } from "@/lib/animations";
import type { CreatedRegistration } from "@/types";

interface RegistrationSuccessPreviewProps {
  registration: CreatedRegistration;
}

function churchLabel(participant: CreatedRegistration["participants"][number]) {
  if (
    participant.churchChapter &&
    participant.churchChapter !== participant.churchName
  ) {
    return `${participant.churchName} · ${participant.churchChapter}`;
  }
  return participant.churchName;
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const response = await fetch("/images/ra-logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result ?? ""));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function downloadRegistrationPreview(registration: CreatedRegistration) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const headerHeight = 96;
  const logoSize = 52;
  const logoX = pageWidth - margin - logoSize;
  const logoY = (headerHeight - logoSize) / 2;
  const textMaxWidth = contentWidth - logoSize - 16;

  doc.setFillColor(27, 36, 82);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  const logoDataUrl = await loadLogoDataUrl();
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 2, "F");
    doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize, logoSize);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("PBA ROYAL AMBASSADORS", margin, 32);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Registration preview", margin, 56, {
    maxWidth: textMaxWidth,
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(registration.programTitle, margin, 76, {
    maxWidth: textMaxWidth,
  });

  const detailsTop = headerHeight + 28;

  doc.setTextColor(26, 26, 46);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Registrant", margin, detailsTop);
  doc.setFont("helvetica", "normal");
  doc.text(registration.registrantName, margin + 78, detailsTop);

  doc.setFont("helvetica", "bold");
  doc.text("Phone", margin, detailsTop + 18);
  doc.setFont("helvetica", "normal");
  doc.text(registration.registrantPhone, margin + 78, detailsTop + 18);

  autoTable(doc, {
    startY: detailsTop + 38,
    head: [["Registration code", "Participant", "Rank", "Church"]],
    body: registration.participants.map((p) => [
      p.registrationCode,
      p.name,
      p.rankName,
      churchLabel(p),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: [26, 26, 46],
      lineColor: [229, 231, 235],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [244, 246, 250],
      textColor: [27, 36, 82],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [27, 36, 82] },
    },
    margin: { left: margin, right: margin },
  });

  const tableEndY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 180;

  const noticeY = tableEndY + 18;
  const notice = `Registration was successful and will go for verification. Participant registration codes are valid after payment verification. If payment is not verified, the registrant will be contacted at ${registration.registrantPhone}.`;

  const noticeLines = doc.splitTextToSize(notice, contentWidth - 24);
  const noticeHeight = noticeLines.length * 13 + 24;

  doc.setFillColor(219, 234, 254);
  doc.roundedRect(margin, noticeY, contentWidth, noticeHeight, 8, 8, "F");
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(noticeLines, margin + 12, noticeY + 16);

  const filename = `pbara-registration-${registration.id || "preview"}.pdf`;
  doc.save(filename);
}

export function RegistrationSuccessPreview({
  registration,
}: RegistrationSuccessPreviewProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      {...mountProps(reduced)}
      variants={motionSafe(reduced, fadeInUp)}
      className="mx-auto max-w-3xl"
    >
      <div className="rounded-2xl border bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <FiCheckCircle size={26} aria-hidden />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-dark md:text-3xl">
            Registration received
          </h1>
          <p className="mt-2 text-sm text-text-muted md:text-base">
            {registration.programTitle}
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Registered participants
            </p>
            <p className="mt-1 text-sm text-text-dark">
              Submitted by{" "}
              <span className="font-semibold">
                {registration.registrantName}
              </span>
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {registration.participants.map((participant) => (
              <li
                key={participant.registrationCode}
                className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text-dark">
                    {participant.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {participant.rankName}
                    {participant.churchName
                      ? ` · ${participant.churchName}`
                      : ""}
                    {participant.churchChapter &&
                    participant.churchChapter !== participant.churchName
                      ? ` (${participant.churchChapter})`
                      : ""}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-sm font-semibold text-primary">
                  {participant.registrationCode}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-xl bg-blue-100 px-4 py-3.5 text-sm leading-relaxed text-blue-950">
          Registration was successful and will go for verification. Participant
          registration codes are valid after payment verification. If payment is
          not verified, the registrant will be contacted at{" "}
          <span className="font-semibold">{registration.registrantPhone}</span>.
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Button
            onPress={() => {
              void downloadRegistrationPreview(registration);
            }}
            startContent={<FiDownload size={16} />}
            variant="bordered"
            className="h-11 border-primary font-semibold text-primary"
          >
            Download PDF
          </Button>
          <Button
            as={Link}
            href="/registration"
            endContent={<FiArrowRight size={16} />}
            className="h-11 bg-primary font-semibold text-white shadow-md"
          >
            Back to registrations
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
