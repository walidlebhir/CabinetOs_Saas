"use client";

import { useEffect, useState } from "react";
import {
  getSelectedCabinet,
  SELECTED_CABINET_EVENT,
  type SelectedCabinet,
} from "@/lib/cabinet-storage";

export function useSelectedCabinet(): SelectedCabinet | null {
  const [cabinet, setCabinet] = useState<SelectedCabinet | null>(null);

  useEffect(() => {
    const sync = () => setCabinet(getSelectedCabinet());
    sync();
    window.addEventListener(SELECTED_CABINET_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SELECTED_CABINET_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return cabinet;
}
