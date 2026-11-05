/** Join class names, skipping falsy values. Server-safe (no client deps). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
