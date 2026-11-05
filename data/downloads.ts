import type { DownloadItem } from "@/types";

// None of these files are in /public/downloads yet. Set `available: true`
// on an item once its file has been added.

export const downloads: DownloadItem[] = [
  {
    id: "1",
    title: "2024 Membership Handbook",
    description: "Official guidelines and code of conduct",
    fileType: "PDF",
    fileUrl: "/downloads/membership-handbook-2024.pdf",
    icon: "document",
  },
  {
    id: "2",
    title: "RA Official Crest Pack",
    description: "High-res PNG & Vector assets",
    fileType: "ZIP",
    fileUrl: "/downloads/ra-crest-pack.zip",
    icon: "shield",
  },
  {
    id: "3",
    title: "Annual Training Calendar",
    description: "Schedule of camps and parades",
    fileType: "PDF",
    fileUrl: "/downloads/training-calendar-2024.pdf",
    icon: "calendar",
  },
  {
    id: "4",
    title: "Rank Advancement Criteria",
    description: "Requirements for promotion levels",
    fileType: "PDF",
    fileUrl: "/downloads/rank-criteria.pdf",
    icon: "badge",
  },
];
