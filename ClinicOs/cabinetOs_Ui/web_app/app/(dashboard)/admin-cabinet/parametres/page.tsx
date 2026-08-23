import type { Metadata } from "next";
import { CabinetConfig } from "@/components/admin/cabinet-config";

export const metadata: Metadata = {
  title: "Paramètres du cabinet",
};

export default function ParametresCabinetPage() {
  return <CabinetConfig />;
}
