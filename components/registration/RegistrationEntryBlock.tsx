"use client";

import type { RegistrationRank } from "@/types";
import type { Chapter } from "@/types";

export interface EntryDraft {
  id: string;
  name: string;
  rankId: string;
  churchId: string;
  sameChurchAsFirst: boolean;
}

export interface EntryFieldErrors {
  name?: string;
  rankId?: string;
  churchId?: string;
}

interface RegistrationEntryBlockProps {
  index: number;
  entry: EntryDraft;
  ranks: RegistrationRank[];
  churches: Chapter[];
  ranksLoading?: boolean;
  churchesLoading?: boolean;
  canRemove: boolean;
  showSameChurchToggle: boolean;
  errors?: EntryFieldErrors;
  onChange: (patch: Partial<EntryDraft>) => void;
  onRemove: () => void;
}

const fieldCx =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-gold focus:ring-2 focus:ring-gold/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-text-muted";

const labelCx = "mb-1.5 block text-sm font-medium text-text-dark";

function chapterLabel(chapter: Chapter) {
  if (
    chapter.chapterName &&
    chapter.churchName &&
    chapter.chapterName !== chapter.churchName
  ) {
    return `${chapter.chapterName} · ${chapter.churchName}`;
  }
  return chapter.chapterName || chapter.churchName;
}

export function RegistrationEntryBlock({
  index,
  entry,
  ranks,
  churches,
  ranksLoading,
  churchesLoading,
  canRemove,
  showSameChurchToggle,
  errors,
  onChange,
  onRemove,
}: RegistrationEntryBlockProps) {
  return (
    <fieldset className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <legend className="font-heading text-base font-semibold text-primary">
          Participant {index + 1}
        </legend>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`entry-name-${entry.id}`} className={labelCx}>
            Full name
          </label>
          <input
            id={`entry-name-${entry.id}`}
            type="text"
            value={entry.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={fieldCx}
            placeholder="Participant full name"
            autoComplete="name"
          />
          {errors?.name ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`entry-rank-${entry.id}`} className={labelCx}>
            Rank
          </label>
          <select
            id={`entry-rank-${entry.id}`}
            value={entry.rankId}
            onChange={(e) => onChange({ rankId: e.target.value })}
            className={fieldCx}
            disabled={ranksLoading}
          >
            <option value="">
              {ranksLoading ? "Loading ranks…" : "Select rank"}
            </option>
            {ranks.map((rank) => (
              <option key={rank.id} value={rank.id}>
                {rank.name}
              </option>
            ))}
          </select>
          {errors?.rankId ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.rankId}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`entry-church-${entry.id}`} className={labelCx}>
            Church / chapter
          </label>
          <select
            id={`entry-church-${entry.id}`}
            value={entry.churchId}
            onChange={(e) =>
              onChange({ churchId: e.target.value, sameChurchAsFirst: false })
            }
            className={fieldCx}
            disabled={churchesLoading || entry.sameChurchAsFirst}
          >
            <option value="">
              {churchesLoading ? "Loading churches…" : "Select church"}
            </option>
            {churches.map((church) => (
              <option key={church.id} value={church.id}>
                {chapterLabel(church)}
              </option>
            ))}
          </select>
          {errors?.churchId ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.churchId}</p>
          ) : null}
        </div>
      </div>

      {showSameChurchToggle ? (
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-text-dark">
          <input
            type="checkbox"
            checked={entry.sameChurchAsFirst}
            onChange={(e) => onChange({ sameChurchAsFirst: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-gold"
          />
          <span>Same church as first entry</span>
        </label>
      ) : null}
    </fieldset>
  );
}
