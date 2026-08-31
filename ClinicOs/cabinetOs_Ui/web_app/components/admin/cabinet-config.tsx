"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Loader2,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Power,
  RotateCw,
  Save,
  Stethoscope,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  activateCabinet,
  createCabinet,
  deactivateCabinet,
  getMyCabinets,
  updateCabinet,
} from "@/modules/cabinet/service/cabinet.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  statusLabel,
} from "@/modules/cabinet/schema/types";
import type {
  AdminCabinet,
  CabinetStatus,
} from "@/modules/cabinet/schema/types";

type Phase = "loading" | "ready" | "refreshing";

type FormState = {
  nom: string;
  specialite: string;
  ville: string;
  localisation: string;
  latitude: string;
  longitude: string;
  status: CabinetStatus;
};

const emptyForm: FormState = {
  nom: "",
  specialite: "",
  ville: "",
  localisation: "",
  latitude: "",
  longitude: "",
  status: "ACTIF",
};

type FormMode = { type: "create" } | { type: "edit"; cabinetId: string };

export function CabinetConfig() {
  const [cabinets, setCabinets] = useState<AdminCabinet[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hasError, setHasError] = useState(false);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyCabinetId, setBusyCabinetId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyCabinets()
      .then((data) => {
        if (!cancelled) setCabinets(data);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
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
      const data = await getMyCabinets();
      setCabinets(data);
      setHasError(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de charger vos cabinets."
        )
      );
    } finally {
      setPhase("ready");
    }
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setFormMode({ type: "create" });
  };

  const openEditForm = (cabinet: AdminCabinet) => {
    setForm({
      nom: cabinet.nom,
      specialite: cabinet.specialite,
      ville: cabinet.ville,
      localisation: cabinet.localisation ?? "",
      latitude:
        cabinet.latitude === null || cabinet.latitude === undefined
          ? ""
          : String(cabinet.latitude),
      longitude:
        cabinet.longitude === null || cabinet.longitude === undefined
          ? ""
          : String(cabinet.longitude),
      status: cabinet.status,
    });
    setFormMode({ type: "edit", cabinetId: cabinet.id });
  };

  const closeForm = () => {
    setFormMode(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      form.nom.trim().length < 2 ||
      form.specialite.trim().length < 2 ||
      form.ville.trim().length < 2
    ) {
      toast.error(
        "Le nom, la spécialité et la ville sont obligatoires (2 caractères minimum)."
      );
      return;
    }

    const latitudeText = form.latitude.trim().replace(",", ".");
    const longitudeText = form.longitude.trim().replace(",", ".");

    if (
      (latitudeText !== "" && longitudeText === "") ||
      (latitudeText === "" && longitudeText !== "")
    ) {
      toast.error(
        "Renseignez la latitude et la longitude ensemble, ou laissez les deux vides."
      );
      return;
    }

    const latitude =
      latitudeText === "" ? null : Number.parseFloat(latitudeText);
    const longitude =
      longitudeText === "" ? null : Number.parseFloat(longitudeText);

    if (latitude !== null && !Number.isFinite(latitude)) {
      toast.error("La latitude doit être un nombre valide.");
      return;
    }
    if (longitude !== null && !Number.isFinite(longitude)) {
      toast.error("La longitude doit être un nombre valide.");
      return;
    }
    if (latitude !== null && (latitude < -90 || latitude > 90)) {
      toast.error("La latitude doit être comprise entre -90 et 90.");
      return;
    }
    if (longitude !== null && (longitude < -180 || longitude > 180)) {
      toast.error("La longitude doit être comprise entre -180 et 180.");
      return;
    }

    if (!formMode) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nom: form.nom.trim(),
        specialite: form.specialite.trim(),
        ville: form.ville.trim(),
        status: form.status,
        localisation: form.localisation.trim() || null,
        latitude,
        longitude,
      };
      const message =
        formMode.type === "create"
          ? await createCabinet(payload)
          : await updateCabinet(formMode.cabinetId, payload);
      toast.success(message);
      closeForm();
      await handleRefresh();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de l'enregistrement."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cabinet: AdminCabinet) => {
    setBusyCabinetId(cabinet.id);
    try {
      const message =
        cabinet.status === "ACTIF"
          ? await deactivateCabinet(cabinet.id)
          : await activateCabinet(cabinet.id);
      toast.success(message);
      setCabinets((current) =>
        current.map((item) =>
          item.id === cabinet.id
            ? {
                ...item,
                status: item.status === "ACTIF" ? "INACTIF" : "ACTIF",
              }
            : item
        )
      );
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de changer le statut du cabinet."
        )
      );
    } finally {
      setBusyCabinetId(null);
    }
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-medos-navy";
  const selectClass =
    "h-11 w-full rounded-lg border border-medos-line bg-white px-4 text-sm text-medos-ink transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40";

  if (phase === "loading") {
    return (
      <div className="space-y-6">
        <div className="h-8 w-72 animate-pulse rounded-lg bg-medos-line/60" />
        <div className="h-64 animate-pulse rounded-2xl border border-medos-line bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          Configuration
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Paramètres du cabinet
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
          Configurez vos cabinets, gérez leurs informations et activez-les ou
          désactivez-les à tout moment.
        </p>
      </div>

      {!formMode && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-medos-slate">
            {cabinets.length === 0
              ? "Aucun cabinet configuré pour le moment."
              : `${cabinets.length} ${
                  cabinets.length > 1 ? "cabinets gérés" : "cabinet géré"
                } par votre compte.`}
          </p>
          <Button size="sm" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            Nouveau cabinet
          </Button>
        </div>
      )}

      {hasError && cabinets.length === 0 && !formMode ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <Building2 className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            Impossible de charger vos cabinets
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
      ) : (
        <>
          {formMode && (
            <form
              className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm sm:p-6"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-medos-navy">
                  {formMode.type === "create"
                    ? "Configurer un nouveau cabinet"
                    : "Modifier le cabinet"}
                </h2>
                <button
                  type="button"
                  aria-label="Fermer le formulaire"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-medos-frost hover:text-medos-navy disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formMode.type === "create" && cabinets.length === 0 && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Bienvenue ! Configurez votre premier cabinet pour démarrer :
                  les médecins, secrétaires et rendez-vous y seront rattachés.
                </p>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nom" className={labelClass}>
                    Nom du cabinet *
                  </label>
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Cabinet Dentaire Sourire"
                    maxLength={100}
                    value={form.nom}
                    onChange={(event) =>
                      setForm({ ...form, nom: event.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="specialite" className={labelClass}>
                    Spécialité *
                  </label>
                  <Input
                    id="specialite"
                    name="specialite"
                    type="text"
                    placeholder="Dentisterie générale"
                    maxLength={100}
                    value={form.specialite}
                    onChange={(event) =>
                      setForm({ ...form, specialite: event.target.value })
                    }
                    required
                  />
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
                <div>
                  <label htmlFor="localisation" className={labelClass}>
                    Localisation
                  </label>
                  <Input
                    id="localisation"
                    name="localisation"
                    type="text"
                    placeholder="Quartier Maârif, rue X, 2ème étage"
                    maxLength={200}
                    value={form.localisation}
                    onChange={(event) =>
                      setForm({ ...form, localisation: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="latitude" className={labelClass}>
                    Latitude
                  </label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="text"
                    inputMode="decimal"
                    placeholder="33.5731"
                    value={form.latitude}
                    onChange={(event) =>
                      setForm({ ...form, latitude: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className={labelClass}>
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="text"
                    inputMode="decimal"
                    placeholder="-7.5898"
                    value={form.longitude}
                    onChange={(event) =>
                      setForm({ ...form, longitude: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="status" className={labelClass}>
                    Statut *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as CabinetStatus,
                      })
                    }
                    required
                    className={selectClass}
                  >
                    <option value="ACTIF">Actif</option>
                    <option value="INACTIF">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSubmitting
                    ? "Enregistrement…"
                    : formMode.type === "create"
                      ? "Créer le cabinet"
                      : "Enregistrer les modifications"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={closeForm}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}

          {!formMode && cabinets.length === 0 && !hasError && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
                <Building2 className="h-5 w-5 text-medos-teal" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-medos-navy">
                Configurez votre premier cabinet
              </h3>
              <p className="mt-1.5 max-w-md text-sm text-medos-slate">
                Renseignez le nom, la spécialité et la ville de votre cabinet
                pour commencer à recevoir des patients.
              </p>
              <Button onClick={openCreateForm} className="mt-5">
                <Plus className="h-4 w-4" />
                Configurer mon cabinet
              </Button>
            </div>
          )}

          {!formMode && cabinets.length > 0 && (
            <div className="space-y-4">
              {cabinets.map((cabinet) => (
                <article
                  key={cabinet.id}
                  className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost">
                        <Building2 className="h-5 w-5 text-medos-teal" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-medos-navy">
                          {cabinet.nom}
                        </h3>
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-medos-teal-dark">
                          <Stethoscope className="h-3.5 w-3.5" />
                          {cabinet.specialite}
                        </p>
                      </div>
                    </div>
                    <span
                      className={
                        cabinet.status === "ACTIF"
                          ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500"
                      }
                    >
                      <span
                        className={
                          cabinet.status === "ACTIF"
                            ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                            : "h-1.5 w-1.5 rounded-full bg-slate-400"
                        }
                      />
                      {statusLabel(cabinet.status)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm text-medos-slate">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {cabinet.ville}
                      {cabinet.localisation ? ` — ${cabinet.localisation}` : ""}
                    </p>
                    {cabinet.latitude !== null &&
                      cabinet.latitude !== undefined &&
                      cabinet.longitude !== null &&
                      cabinet.longitude !== undefined && (
                        <p className="flex items-center gap-1.5">
                          <Navigation className="h-3.5 w-3.5 shrink-0" />
                          GPS :{" "}
                          {Number(cabinet.latitude).toFixed(6)},{" "}
                          {Number(cabinet.longitude).toFixed(6)}
                        </p>
                      )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-medos-line/60 pt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditForm(cabinet)}
                      disabled={busyCabinetId === cabinet.id}
                    >
                      <Pencil className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant={cabinet.status === "ACTIF" ? "navy" : "primary"}
                      onClick={() => handleToggleStatus(cabinet)}
                      disabled={busyCabinetId === cabinet.id}
                    >
                      {busyCabinetId === cabinet.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                      {cabinet.status === "ACTIF" ? "Désactiver" : "Activer"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
