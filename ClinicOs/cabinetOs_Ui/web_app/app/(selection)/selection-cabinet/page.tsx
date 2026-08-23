import type { Metadata } from "next";
import { CabinetSelection } from "@/components/admin/cabinet-selection";

export const metadata: Metadata = {
  title: "Choisir un cabinet",
};

export default function SelectionCabinetPage() {
  return <CabinetSelection />;
}
