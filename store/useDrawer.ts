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
  | "edit-event"
  | "create-gallery"
  | "edit-gallery"
  | "edit-director-desk";

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

type DrawerBody = object;

interface DrawerState {
  view: DrawerView | null;
  body: DrawerBody;
  config: {
    size: DrawerSize;
    placement: DrawerPlacement;
  };
  openDrawer: (
    view: DrawerView,
    options?: { config?: DrawerOptions; body?: object },
  ) => void;
  closeDrawer: () => void;
}

export const useDrawer = create<DrawerState>((set) => ({
  view: null,
  body: {},
  config: {
    size: "md",
    placement: "right",
  },
  openDrawer: (view, options) =>
    set((state) => ({
      view,
      body: options?.body ?? {},
      config: { ...state.config, ...(options?.config ?? {}) },
    })),
  closeDrawer: () =>
    set({
      view: null,
      body: {},
    }),
}));

/**
 * Type-safe payload reader. Cast to `T` at the call site:
 *
 * ```ts
 * const exec = useDrawerPayload<AdminExecutive>();
 * ```
 */
export function useDrawerBody<T>() {
  return useDrawer((s) => s.body as T);
}
