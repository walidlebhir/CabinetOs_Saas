export type SelectedCabinet = {
  id: string;
  nom: string;
  status: string;
};

const SELECTED_CABINET_KEY = "medos_selected_cabinet";
export const SELECTED_CABINET_EVENT = "medos:selected-cabinet-changed";

export function saveSelectedCabinet(cabinet: SelectedCabinet) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SELECTED_CABINET_KEY, JSON.stringify(cabinet));
  window.dispatchEvent(new Event(SELECTED_CABINET_EVENT));
}

export function getSelectedCabinet(): SelectedCabinet | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SELECTED_CABINET_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SelectedCabinet;
    return parsed.id && parsed.nom ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSelectedCabinet() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SELECTED_CABINET_KEY);
  window.dispatchEvent(new Event(SELECTED_CABINET_EVENT));
}

export const selectedCabinetStore = {
  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  getSnapshot(): string {
    const cabinet = getSelectedCabinet();
    return cabinet ? JSON.stringify(cabinet) : "";
  },
  getServerSnapshot(): string {
    return "";
  },
};
