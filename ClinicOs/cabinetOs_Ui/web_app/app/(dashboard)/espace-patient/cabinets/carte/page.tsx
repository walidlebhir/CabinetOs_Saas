import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CabinetsMapView } from "@/components/patient/cabinets-map-view";

export const metadata: Metadata = {
  title: "Localisation des cabinets",
};

export default function CabinetsCartePage() {
  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100dvh-8rem)]">
      <Button
        href="/espace-patient/cabinets"
        variant="secondary"
        size="icon"
        aria-label="Retour aux cabinets"
        className="shrink-0 rounded-full"
      >
        <ArrowLeft className="h-5 w-5 text-medos-navy" />
      </Button>

      <div className="lg:min-h-0 lg:flex-1">
        <CabinetsMapView />
      </div>
    </div>
  );
}
