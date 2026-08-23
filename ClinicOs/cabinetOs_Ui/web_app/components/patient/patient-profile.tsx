"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Droplets,
  HeartPulse,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  RotateCw,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addPatientInfo,
  getPatientInfo,
  updatePatientInfo,
} from "@/modules/patient/service/patient.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  BLOOD_GROUPS,
  SEX_OPTIONS,
  hasPatientInfo,
  sexLabel,
} from "@/modules/patient/schema/types";
import type { PatientInfo, Sex } from "@/modules/patient/schema/types";

type Phase = "loading" | "ready" | "refreshing";

type FormState = {
  date_naissance: string;
  sex: Sex | "";
  groupe_sanguin: string;
  allergie: string;
  antecedents: string;
  adresse: string;
  ville: string;
};

const emptyForm: FormState = {
  date_naissance: "",
  sex: "",
  groupe_sanguin: "",
  allergie: "",
  antecedents: "",
  adresse: "",
  ville: "",
};

function toFormState(patient: PatientInfo): FormState {
  return {
    date_naissance: patient.date_naissance ?? "",
    sex: patient.sex ?? "",
    groupe_sanguin: patient.groupe_sanguin ?? "",
    allergie: patient.allergie ?? "",
    antecedents: patient.antecedents ?? "",
    adresse: patient.adresse ?? "",
    ville: patient.ville ?? "",
  };
}

const today = new Date().toISOString().slice(0, 10);

export function PatientProfile() {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hasError, setHasError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const applyPatient = (data: PatientInfo) => {
    const firstSetup = !hasPatientInfo(data);
    setPatient(data);
    setIsEditing(firstSetup);
    setForm(firstSetup ? emptyForm : toFormState(data));
  };

  useEffect(() => {
    let cancelled = false;
    getPatientInfo()
      .then((data) => {
        if (!cancelled) applyPatient(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setHasError(true);
          toast.error(
            extractApiErrorMessage(error, "Impossible de charger votre profil.")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setPhase("ready");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = async () => {
    setPhase("refreshing");
    try {
      const data = await getPatientInfo();
      setHasError(false);
      applyPatient(data);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Impossible de charger votre profil.")
      );
    } finally {
      setPhase("ready");
    }
  };

  const handleCancelEdit = () => {
    if (patient && hasPatientInfo(patient)) {
      setForm(toFormState(patient));
      setIsEditing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.date_naissance || !form.sex || !form.groupe_sanguin.trim()) {
      toast.error(
        "Veuillez renseigner la date de naissance, le sexe et le groupe sanguin."
      );
      return;
    }
    if (
      form.date_naissance >= today ||
      form.adresse.trim().length < 2 ||
      form.ville.trim().length < 2
    ) {
      toast.error(
        "La date de naissance doit être dans le passé, l'adresse et la ville sont obligatoires."
      );
      return;
    }

    if (!patient) return;

    const isFirstSetup = !hasPatientInfo(patient);

    setIsSubmitting(true);
    try {
      const payload = {
        date_naissance: form.date_naissance,
        sex: form.sex as Sex,
        groupe_sanguin: form.groupe_sanguin.trim(),
        allergie: form.allergie.trim() || null,
        antecedents: form.antecedents.trim() || null,
        adresse: form.adresse.trim(),
        ville: form.ville.trim(),
      };
      const message = isFirstSetup
        ? await addPatientInfo(payload)
        : await updatePatientInfo(payload);
      toast.success(message);
      setIsEditing(false);
      applyPatient({
        ...patient,
        date_naissance: payload.date_naissance,
        sex: payload.sex,
        groupe_sanguin: payload.groupe_sanguin,
        allergie: payload.allergie,
        antecedents: payload.antecedents,
        adresse: payload.adresse,
        ville: payload.ville,
      });
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de l'enregistrement."
        )
      );
    } finally {
      setIsSubmitting(false);
      setPhase("ready");
    }
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-medos-navy";
  const textareaClass =
    "w-full rounded-lg border border-medos-line bg-white px-4 py-2.5 text-sm text-medos-ink placeholder:text-medos-slate/60 transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40";

  if (phase === "loading") {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-medos-line/60" />
        <div className="h-64 animate-pulse rounded-2xl border border-medos-line bg-white" />
      </div>
    );
  }

  if (!patient || hasError) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <UserRound className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            Impossible de charger votre profil
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-medos-slate">
            Vérifiez que vous êtes connecté et que le backend est démarré puis
            réessayez.
          </p>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={phase === "refreshing"}
            className="mt-5"
          >
            <RotateCw
              className={
                phase === "refreshing" ? "h-4 w-4 animate-spin" : "h-4 w-4"
              }
            />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const firstSetup = !hasPatientInfo(patient);
  const showForm = isEditing || firstSetup;

  return (
    <div className="space-y-6">
      <Header />

      <div className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost">
              <UserRound className="h-5 w-5 text-medos-teal" />
            </span>
            <div>
              <p className="text-base font-bold text-medos-navy">
                {patient.name}
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs text-medos-slate">
                <Mail className="h-3.5 w-3.5" />
                {patient.email}
              </p>
            </div>
          </div>
          {!showForm && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setForm(toFormState(patient));
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>

        {!showForm && (
          <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-medos-line/60 pt-5 sm:grid-cols-2">
            <InfoItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Date de naissance"
              value={patient.date_naissance ?? "—"}
            />
            <InfoItem
              icon={<UserRound className="h-4 w-4" />}
              label="Sexe"
              value={sexLabel(patient.sex)}
            />
            <InfoItem
              icon={<Droplets className="h-4 w-4" />}
              label="Groupe sanguin"
              value={patient.groupe_sanguin ?? "—"}
            />
            <InfoItem
              icon={<MapPin className="h-4 w-4" />}
              label="Ville"
              value={patient.ville ?? "—"}
            />
            <InfoItem
              icon={<MapPin className="h-4 w-4" />}
              label="Adresse"
              value={patient.adresse ?? "—"}
            />
            <InfoItem
              icon={<HeartPulse className="h-4 w-4" />}
              label="Allergies"
              value={patient.allergie || "Aucune allergie renseignée"}
            />
            <InfoItem
              icon={<HeartPulse className="h-4 w-4" />}
              label="Antécédents médicaux"
              value={
                patient.antecedents || "Aucun antécédent renseigné"
              }
            />
          </dl>
        )}

        {showForm && (
          <form
            className="mt-6 space-y-4 border-t border-medos-line/60 pt-5"
            onSubmit={handleSubmit}
          >
            {firstSetup && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Bienvenue ! Complétez vos informations médicales pour
                finaliser votre compte.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date_naissance" className={labelClass}>
                  Date de naissance *
                </label>
                <Input
                  id="date_naissance"
                  name="date_naissance"
                  type="date"
                  max={today}
                  value={form.date_naissance}
                  onChange={(event) =>
                    setForm({ ...form, date_naissance: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="sex" className={labelClass}>
                  Sexe *
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={form.sex}
                  onChange={(event) =>
                    setForm({ ...form, sex: event.target.value as Sex | "" })
                  }
                  required
                  className="h-11 w-full rounded-lg border border-medos-line bg-white px-4 text-sm text-medos-ink transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
                >
                  <option value="" disabled>
                    Sélectionner…
                  </option>
                  {SEX_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="groupe_sanguin" className={labelClass}>
                  Groupe sanguin *
                </label>
                <select
                  id="groupe_sanguin"
                  name="groupe_sanguin"
                  value={form.groupe_sanguin}
                  onChange={(event) =>
                    setForm({ ...form, groupe_sanguin: event.target.value })
                  }
                  required
                  className="h-11 w-full rounded-lg border border-medos-line bg-white px-4 text-sm text-medos-ink transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
                >
                  <option value="" disabled>
                    Sélectionner…
                  </option>
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ville" className={labelClass}>
                  Ville *
                </label>
                <Input
                  id="ville"
                  name="ville"
                  type="text"
                  placeholder="Casablanca"
                  maxLength={100}
                  value={form.ville}
                  onChange={(event) =>
                    setForm({ ...form, ville: event.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="adresse" className={labelClass}>
                Adresse *
              </label>
              <Input
                id="adresse"
                name="adresse"
                type="text"
                placeholder="12 rue des Lilas, quartier Maârif"
                maxLength={200}
                value={form.adresse}
                onChange={(event) =>
                  setForm({ ...form, adresse: event.target.value })
                }
                required
              />
            </div>

            <div>
              <label htmlFor="allergie" className={labelClass}>
                Allergies
              </label>
              <textarea
                id="allergie"
                name="allergie"
                rows={2}
                maxLength={500}
                placeholder="Pénicilline, pollen…"
                value={form.allergie}
                onChange={(event) =>
                  setForm({ ...form, allergie: event.target.value })
                }
                className={textareaClass}
              />
            </div>

            <div>
              <label htmlFor="antecedents" className={labelClass}>
                Antécédents médicaux
              </label>
              <textarea
                id="antecedents"
                name="antecedents"
                rows={3}
                maxLength={1000}
                placeholder="Maladies chroniques, opérations, traitements en cours…"
                value={form.antecedents}
                onChange={(event) =>
                  setForm({ ...form, antecedents: event.target.value })
                }
                className={textareaClass}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting
                  ? "Enregistrement…"
                  : firstSetup
                    ? "Enregistrer mes informations"
                    : "Mettre à jour"}
              </Button>
              {!firstSetup && (
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
        Compte
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
        Mon profil
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
        Consultez et mettez à jour vos informations personnelles et médicales.
      </p>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-medos-frost text-medos-teal [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-medos-slate">
          {label}
        </dt>
        <dd className="mt-0.5 whitespace-pre-line break-words text-sm font-medium text-medos-navy">
          {value}
        </dd>
      </div>
    </div>
  );
}
