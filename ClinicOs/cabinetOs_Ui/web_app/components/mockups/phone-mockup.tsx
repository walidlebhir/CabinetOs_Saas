import {
  Search,
  Star,
  Home,
  CalendarDays,
  Bell,
  User,
  Signal,
  Wifi,
  BatteryFull,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SPECIALTIES = ["Généraliste", "Cardiologue", "Pédiatre", "Dentiste"];

const DOCTORS = [
  {
    initials: "LF",
    name: "Dr. Leila Fassi",
    specialty: "Cardiologie",
    rating: "4,9",
    availability: "Disponible aujourd'hui",
    available: true,
  },
  {
    initials: "MB",
    name: "Dr. Mehdi Benali",
    specialty: "Généraliste",
    rating: "4,8",
    availability: "Prochain créneau demain",
    available: false,
  },
];

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] overflow-hidden rounded-[2.75rem] border-[10px] border-medos-navy bg-white shadow-[0_32px_64px_-28px_rgba(6,59,92,0.45)]">
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-medos-navy" />
      <div className="bg-medos-mist px-4 pb-4 pt-9">
        <div className="flex items-center justify-between text-medos-navy">
          <span className="text-[10px] font-semibold tabular-nums">9:41</span>
          <span className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="mt-3 leading-tight">
          <p className="text-sm font-bold text-medos-navy">Bonjour Amina,</p>
          <p className="text-[11px] text-medos-slate">
            Trouvez votre médecin et réservez en quelques secondes.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-medos-line bg-white px-3 py-2.5">
          <Search className="h-3.5 w-3.5 text-medos-teal" />
          <span className="text-[10px] text-medos-slate">
            Rechercher un médecin…
          </span>
        </div>

        <div className="mt-3 flex gap-1.5 overflow-hidden">
          {SPECIALTIES.map((specialty, i) => (
            <span
              key={specialty}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold",
                i === 0
                  ? "bg-medos-teal text-white"
                  : "border border-medos-line bg-white text-medos-slate"
              )}
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {DOCTORS.map((doctor) => (
            <div
              key={doctor.name}
              className="rounded-xl border border-medos-line bg-white p-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-medos-frost text-[10px] font-bold text-medos-teal-dark">
                  {doctor.initials}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[11px] font-bold text-medos-navy">
                    {doctor.name}
                  </p>
                  <p className="text-[9px] text-medos-slate">{doctor.specialty}</p>
                </div>
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-medos-ink">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {doctor.rating}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={cn(
                    "flex items-center gap-1 text-[9px] font-medium",
                    doctor.available
                      ? "text-medos-teal-dark"
                      : "text-medos-slate"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      doctor.available ? "bg-medos-teal" : "bg-medos-line"
                    )}
                  />
                  {doctor.availability}
                </span>
                <span className="rounded-lg bg-medos-teal px-2.5 py-1 text-[9px] font-bold text-white">
                  Réserver
                </span>
              </div>
            </div>
          ))}
        </div>

        <nav className="mt-3 flex items-center justify-around rounded-2xl border border-medos-line bg-white py-2.5">
          {[Home, CalendarDays, Bell, User].map((Icon, i) => (
            <Icon
              key={i}
              className={cn("h-4 w-4", i === 0 ? "text-medos-teal" : "text-medos-slate")}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
