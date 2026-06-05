import { create } from "zustand";

export type DrawerView =
  | "create-executive"
  | "edit-executive"
  | "create-office"
  | "edit-office"
  | "create-church"
  | "edit-church"
  | "create-news"
  | "edit-news"
  | "create-event"
  | "edit-event";

export type DrawerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

export type DrawerPlacement = "right" | "left" | "top" | "bottom";

interface DrawerOptions {
  size?: DrawerSize;
  placement?: DrawerPlacement;
}

interface DrawerState {
  view: DrawerView | null;
  payload: unknown;
  size: DrawerSize;
  placement: DrawerPlacement;
  openDrawer: <T = unknown>(
    view: DrawerView,
    payload?: T,
    options?: DrawerOptions,
  ) => void;
  closeDrawer: () => void;
}

export const useDrawer = create<DrawerState>((set) => ({
  view: null,
  payload: undefined,
  size: "md",
  placement: "right",
  openDrawer: (view, payload, options) =>
    set({
      view,
      payload,
      size: options?.size ?? "md",
      placement: options?.placement ?? "right",
    }),
  closeDrawer: () =>
    set({
      view: null,
      payload: undefined,
    }),
}));

/**
 * Type-safe payload reader. Cast to `T` at the call site:
 *
 * ```ts
 * const exec = useDrawerPayload<AdminExecutive>();
 * ```
 */
export function useDrawerPayload<T>() {
  return useDrawer((s) => s.payload as T | undefined);
}
