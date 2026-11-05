const SMALL_WORDS = new Set(["of", "and", "the", "in", "on", "at"]);
const KEEP_UPPER = new Set(["FBC", "RA", "PBA", "RAN", "CAC", "UK", "USA"]);

/**
 * Turns admin-entered names like "KING OF GLORY BC" into
 * "King of Glory Baptist Church". Mixed-case input is left alone.
 */
export function formatChurchName(raw: string | undefined | null): string {
  const name = (raw ?? "").trim();
  if (!name) return "";
  if (name !== name.toUpperCase()) return name;

  return name
    .split(/\s+/)
    .map((word, i) => {
      const bare = word.replace(/[,.;]+$/, "");
      const trail = word.slice(bare.length);
      if (bare === "BC") return `Baptist Church${trail}`;
      if (KEEP_UPPER.has(word)) return word;
      const lower = word.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.replace(/(^|-)[a-z]/g, (m) => m.toUpperCase());
    })
    .join(" ");
}

/** Placeholder values that should not be shown as a person's name. */
export function isMeaningfulName(value: string | undefined | null) {
  const v = (value ?? "").trim();
  return v.length > 0 && !["—", "-", "TBD", "N/A"].includes(v.toUpperCase());
}

/** Collapse line breaks so admin-entered text reads well in short, clamped previews. */
export function previewText(value: string | undefined | null) {
  return (value ?? "").replace(/\s*\n+\s*/g, " ").trim();
}
