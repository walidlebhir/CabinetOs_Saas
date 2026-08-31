import type { Metadata } from "next";
import { ParametresTabs } from "@/components/admin/parametres-tabs";

export const metadata: Metadata = {
  title: "Paramètres",
};

export default function ParametresCabinetPage() {
  return <ParametresTabs />;
}
