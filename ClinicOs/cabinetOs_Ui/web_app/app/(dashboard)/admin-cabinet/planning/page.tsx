import type { Metadata } from "next";
import { PlanningManager } from "@/components/admin/planning-manager";

export const metadata: Metadata = {
  title: "Planning",
};

export default function PlanningPage() {
  return <PlanningManager />;
}
