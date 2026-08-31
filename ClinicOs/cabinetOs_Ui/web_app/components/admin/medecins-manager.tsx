"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  RotateCw,
  Stethoscope,
  Upload,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import { getSessionUser } from "@/lib/auth-storage";
import {
  createMedecin,
  createMedecinAccount,
  deleteMedecin,
  exportMedecins,
  getMedecin,
  getMedecinsByCabinet,
  importMedecins,
  setUserAccountActive,
  updateMedecin,
} from "@/modules/admin/service/medecin.api";
import type { Medecin, MedecinImportResult } from "@/modules/admin/schema/types";
import { useSelectedCabinet } from "./use-selected-cabinet";
import { SlideOverPanel } from "./slide-over-panel";
import { ConfirmDialog } from "./confirm-dialog";
import { ModalPanel } from "./modal-panel";
import { MedecinActionsMenu } from "./medecins-actions-menu";

type LoadPhase = "loading" | "ready" | "refreshing";

type FormState = {
  nom: string;
  prenom: string;
  specialite: string;
  numeroOrder: string;
  teliphone: string;
  biographie: string;
  anneesExperience: string;
};

const emptyForm: FormState = {
  nom: "",
  prenom: "",
  specialite: "",
  numeroOrder: "",
  teliphone: "",
  biographie: "",
  anneesExperience: "0",
};

type ToggleTarget = {
  medecin: Medecin;
  nextActive: boolean;
};

function fullName(medecin: Medecin): string {
  return `Dr ${medecin.prenom} ${medecin.nom}`;
}

function validateForm(form: FormState): string | null {
  const anneesExperience = Number.parseInt(form.anneesExperience, 10);
  if (
    form.nom.trim().length < 2 ||
    form.prenom.trim().length < 2 ||
    form.specialite.trim().length < 2 ||
    form.numeroOrder.trim().length < 2
  ) {
    return "Le nom, le prénom, la spécialité et le numéro d'ordre sont obligatoires.";
  }
  if (!Number.isInteger(anneesExperience) || anneesExperience < 0) {
    return "Les années d'expérience doivent être un nombre positif.";
  }
  return null;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-medos-line/60 py-2.5 last:border-0">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-medos-slate">
        {label}
      </span>
      <span className="min-w-0 break-words text-right text-sm font-medium text-medos-ink">
        {value ?? "—"}
      </span>
    </div>
  );
}

function AccountStatusBadge({ medecin }: { medecin: Medecin }) {
  if (!medecin.hasAccount) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
        Aucun compte
      </span>
    );
  }
  if (medecin.accountActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <BadgeCheck className="h-3.5 w-3.5" />
        Actif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Désactivé
    </span>
  );
}

export function MedecinsManager() {
  const cabinet = useSelectedCabinet();
  const cabinetId = cabinet?.id ?? null;
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [loadedCabinetId, setLoadedCabinetId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountTarget, setAccountTarget] = useState<Medecin | null>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [canManageAccounts, setCanManageAccounts] = useState(false);
  const [detailsTarget, setDetailsTarget] = useState<Medecin | null>(null);
  const [detailsData, setDetailsData] = useState<Medecin | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [editTarget, setEditTarget] = useState<Medecin | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Medecin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<ToggleTarget | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] =
    useState<MedecinImportResult | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isLoading =
    phase === "loading" || (cabinetId !== null && loadedCabinetId !== cabinetId);

  useEffect(() => {
    const sync = () => setCanManageAccounts(getSessionUser()?.role === "ADMIN");
    sync();
  }, []);

  useEffect(() => {
    if (!cabinetId) return;
    let cancelled = false;
    getMedecinsByCabinet(cabinetId)
      .then((data) => {
        if (!cancelled) {
          setMedecins(data);
          setHasError(false);
          setLoadedCabinetId(cabinetId);
          setPhase("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
          setLoadedCabinetId(cabinetId);
          setPhase("ready");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cabinetId]);

  const reloadMedecins = useCallback(async () => {
    if (!cabinetId) return;
    setPhase("refreshing");
    try {
      const data = await getMedecinsByCabinet(cabinetId);
      setMedecins(data);
      setHasError(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Impossible de charger les médecins.")
      );
    } finally {
      setPhase("ready");
    }
  }, [cabinetId]);

  const closeAddPanel = useCallback(() => {
    setAddPanelOpen(false);
    setForm(emptyForm);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cabinetId) return;

    const validationError = validateForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createMedecin({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        specialite: form.specialite.trim(),
        numeroOrder: form.numeroOrder.trim(),
        teliphone: form.teliphone.trim() || null,
        biographie: form.biographie.trim() || null,
        anneesExperience: Number.parseInt(form.anneesExperience, 10),
        cabinetId,
      });
      toast.success(`Médecin ${form.nom.trim()} ajouté avec succès.`);
      closeAddPanel();
      await reloadMedecins();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de la création du médecin."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAccountPanel = useCallback((medecin: Medecin) => {
    setAccountTarget(medecin);
    setAccountEmail(medecin.email ?? "");
  }, []);

  const handleCreateAccount = async () => {
    if (!accountTarget) return;
    const email = accountEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Veuillez saisir une adresse email valide.");
      return;
    }

    setIsCreatingAccount(true);
    try {
      await createMedecinAccount({ medecinId: accountTarget.id, email });
      toast.success(
        `Compte créé pour ${accountTarget.prenom} ${accountTarget.nom}. Le mot de passe temporaire a été envoyé par email.`
      );
      setAccountTarget(null);
      setAccountEmail("");
      await reloadMedecins();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de créer le compte de ce médecin."
        )
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const openDetails = useCallback(async (medecin: Medecin) => {
    setDetailsTarget(medecin);
    setDetailsData(medecin);
    setIsLoadingDetails(true);
    try {
      const fresh = await getMedecin(medecin.id);
      setDetailsData(fresh);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de charger les détails du médecin."
        )
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsTarget(null);
    setDetailsData(null);
    setIsLoadingDetails(false);
  }, []);

  const openEdit = useCallback((medecin: Medecin) => {
    setEditTarget(medecin);
    setEditForm({
      nom: medecin.nom ?? "",
      prenom: medecin.prenom ?? "",
      specialite: medecin.specialite ?? "",
      numeroOrder: medecin.numeroOrder ?? "",
      teliphone: medecin.teliphone ?? "",
      biographie: medecin.biographie ?? "",
      anneesExperience: String(medecin.anneesExperience ?? 0),
    });
  }, []);

  const closeEdit = useCallback(() => {
    setEditTarget(null);
    setEditForm(emptyForm);
  }, []);

  const handleUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTarget) return;

    const validationError = validateForm(editForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUpdating(true);
    try {
      await updateMedecin({
        id: editTarget.id,
        nom: editForm.nom.trim(),
        prenom: editForm.prenom.trim(),
        specialite: editForm.specialite.trim(),
        numeroOrder: editForm.numeroOrder.trim(),
        teliphone: editForm.teliphone.trim() || null,
        biographie: editForm.biographie.trim() || null,
        anneesExperience: Number.parseInt(editForm.anneesExperience, 10),
      });
      toast.success(`${fullName(editTarget)} modifié avec succès.`);
      closeEdit();
      await reloadMedecins();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de la modification du médecin."
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteMedecin(deleteTarget.id);
      toast.success(`${fullName(deleteTarget)} supprimé avec succès.`);
      setDeleteTarget(null);
      await reloadMedecins();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de supprimer ce médecin."
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const requestToggleAccount = useCallback((medecin: Medecin) => {
    if (!medecin.accountId) return;
    setToggleTarget({
      medecin,
      nextActive: !medecin.accountActive,
    });
  }, []);

  const handleToggleConfirm = async () => {
    const target = toggleTarget;
    const accountId = target?.medecin.accountId;
    if (!accountId || !target) return;
    const { medecin, nextActive } = target;

    setIsToggling(true);
    try {
      await setUserAccountActive({
        accountId,
        active: nextActive,
      });
      toast.success(
        nextActive
          ? `Compte de ${fullName(medecin)} activé.`
          : `Compte de ${fullName(medecin)} désactivé.`
      );
      setToggleTarget(null);
      await reloadMedecins();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          nextActive
            ? "Impossible d'activer le compte de ce médecin."
            : "Impossible de désactiver le compte de ce médecin."
        )
      );
      await reloadMedecins();
    } finally {
      setIsToggling(false);
    }
  };

  const closeImport = useCallback(() => {
    setImportOpen(false);
    setImportFile(null);
    setImportResult(null);
  }, []);

  const handleImportFile = async () => {
    if (!cabinetId || !importFile) return;

    setIsImporting(true);
    setImportResult(null);
    try {
      const result = await importMedecins(importFile, cabinetId);
      setImportResult(result);
      if (result.importes > 0) await reloadMedecins();
      if (result.importes > 0 && result.erreurs.length === 0) {
        toast.success(`${result.importes} médecin(s) importé(s) avec succès.`);
      }
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible d'importer le fichier de médecins."
        )
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (format: "csv" | "xlsx") => {
    if (!cabinetId) return;

    setIsExporting(true);
    try {
      const blob = await exportMedecins(format, cabinetId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `medecins.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`Export des médecins téléchargé (${format.toUpperCase()}).`);
      setExportOpen(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible d'exporter les médecins."
        )
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!cabinet?.id || !cabinetId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
          <Building2 className="h-5 w-5 text-medos-teal" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-medos-navy">
          Aucun cabinet sélectionné
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-medos-slate">
          Sélectionnez un cabinet depuis la barre en haut, ou configurez-en un
          pour commencer à ajouter vos médecins.
        </p>
        <Button href="/admin-cabinet/parametres" className="mt-5">
          Configurer mes cabinets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-medos-slate">
          Cabinet :{" "}
          <span className="font-semibold text-medos-navy">{cabinet.nom}</span>{" "}
          ·{" "}
          {medecins.length === 0
            ? "aucun médecin"
            : `${medecins.length} ${
                medecins.length > 1 ? "médecins" : "médecin"
              }`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void reloadMedecins()}
            disabled={phase === "refreshing"}
          >
            <RotateCw
              className={
                phase === "refreshing" ? "h-4 w-4 animate-spin" : "h-4 w-4"
              }
            />
            Actualiser
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Importer
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setExportOpen(true)}
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" onClick={() => setAddPanelOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Nouveau médecin
          </Button>
        </div>
      </div>

      {hasError && medecins.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-medos-line bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-medos-navy">
            Impossible de charger les médecins de ce cabinet.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => void reloadMedecins()}
            disabled={phase === "refreshing"}
          >
            Réessayer
          </Button>
        </div>
      ) : isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-medos-line bg-white" />
      ) : medecins.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <Stethoscope className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            Aucun médecin dans ce cabinet
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-medos-slate">
            Ajoutez votre premier médecin pour commencer à recevoir des
            rendez-vous.
          </p>
          <Button onClick={() => setAddPanelOpen(true)} className="mt-5">
            <UserPlus className="h-4 w-4" />
            Ajouter un médecin
          </Button>
        </div>
      ) : (
        <section className="rounded-2xl border border-medos-line bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-medos-line px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-medos-navy">
                Liste des médecins
              </h2>
              <p className="text-xs text-medos-slate">
                {medecins.length}{" "}
                {medecins.length > 1 ? "médecins enregistrés" : "médecin enregistré"}
              </p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-medos-line bg-medos-mist/60 text-xs uppercase tracking-wide text-medos-slate">
                  <th className="px-5 py-3 font-semibold">Médecin</th>
                  <th className="px-5 py-3 font-semibold">Spécialité</th>
                  <th className="px-5 py-3 font-semibold">N° d&apos;ordre</th>
                  <th className="px-5 py-3 font-semibold">Téléphone</th>
                  <th className="px-5 py-3 font-semibold">Expérience</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {medecins.map((medecin) => {
                  return (
                    <tr
                      key={medecin.id}
                      className="border-b border-medos-line/60 last:border-0 transition-colors hover:bg-medos-frost/50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-medos-frost text-xs font-bold text-medos-teal-dark">
                            {`${medecin.prenom.charAt(0)}${medecin.nom.charAt(0)}`.toUpperCase()}
                          </span>
                          <span className="font-semibold text-medos-navy">
                            Dr {medecin.prenom} {medecin.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-medos-slate">
                        {medecin.specialite}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-medos-ink">
                        {medecin.numeroOrder}
                      </td>
                      <td className="px-5 py-3.5 text-medos-slate">
                        {medecin.teliphone ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-medos-slate">
                        {medecin.anneesExperience}{" "}
                        {medecin.anneesExperience > 1 ? "ans" : "an"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <MedecinActionsMenu
                          medecin={medecin}
                          canManageAccounts={canManageAccounts}
                          actions={{
                            onView: () => void openDetails(medecin),
                            onEdit: () => openEdit(medecin),
                            onCreateAccount: () => openAccountPanel(medecin),
                            onToggleAccount: () =>
                              requestToggleAccount(medecin),
                            onDelete: () => setDeleteTarget(medecin),
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <SlideOverPanel
        open={addPanelOpen}
        onClose={isSubmitting ? () => {} : closeAddPanel}
        title="Nouveau médecin"
        subtitle={`Ajout au cabinet : ${cabinet.nom}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="med-nom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Nom *
            </label>
            <Input
              id="med-nom"
              type="text"
              placeholder="El Amrani"
              maxLength={100}
              value={form.nom}
              onChange={(event) => setForm({ ...form, nom: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="med-prenom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Prénom *
            </label>
            <Input
              id="med-prenom"
              type="text"
              placeholder="Youssef"
              maxLength={100}
              value={form.prenom}
              onChange={(event) =>
                setForm({ ...form, prenom: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-specialite" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Spécialité *
            </label>
            <Input
              id="med-specialite"
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
            <label htmlFor="med-numero-order" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Numéro d&apos;ordre *
            </label>
            <Input
              id="med-numero-order"
              type="text"
              placeholder="12345"
              maxLength={50}
              value={form.numeroOrder}
              onChange={(event) =>
                setForm({ ...form, numeroOrder: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-tel" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Téléphone
            </label>
            <Input
              id="med-tel"
              type="tel"
              placeholder="+212 6 00 00 00 00"
              maxLength={30}
              value={form.teliphone}
              onChange={(event) =>
                setForm({ ...form, teliphone: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="med-exp" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Années d&apos;expérience *
            </label>
            <Input
              id="med-exp"
              type="number"
              min={0}
              max={70}
              step={1}
              value={form.anneesExperience}
              onChange={(event) =>
                setForm({ ...form, anneesExperience: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-bio" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Biographie
            </label>
            <textarea
              id="med-bio"
              rows={4}
              placeholder="Présentation du médecin, diplômes, parcours…"
              maxLength={1000}
              value={form.biographie}
              onChange={(event) =>
                setForm({ ...form, biographie: event.target.value })
              }
              className="w-full rounded-lg border border-medos-line bg-white px-4 py-2.5 text-sm text-medos-ink placeholder:text-medos-slate/60 transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
            />
          </div>

          <p className="rounded-lg border border-medos-line bg-medos-frost px-4 py-3 text-xs leading-relaxed text-medos-slate">
            Après l&apos;ajout, créez le compte d&apos;accès depuis la colonne
            « Action » du tableau : un mot de passe temporaire sera envoyé par
            email.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isSubmitting ? "Ajout…" : "Ajouter le médecin"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={closeAddPanel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </SlideOverPanel>

      <SlideOverPanel
        open={editTarget !== null}
        onClose={isUpdating ? () => {} : closeEdit}
        title="Modifier le médecin"
        subtitle={
          editTarget
            ? `${fullName(editTarget)} — ${editTarget.specialite}`
            : undefined
        }
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label htmlFor="med-edit-nom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Nom *
            </label>
            <Input
              id="med-edit-nom"
              type="text"
              maxLength={100}
              value={editForm.nom}
              onChange={(event) =>
                setEditForm({ ...editForm, nom: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-edit-prenom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Prénom *
            </label>
            <Input
              id="med-edit-prenom"
              type="text"
              maxLength={100}
              value={editForm.prenom}
              onChange={(event) =>
                setEditForm({ ...editForm, prenom: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-edit-specialite" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Spécialité *
            </label>
            <Input
              id="med-edit-specialite"
              type="text"
              maxLength={100}
              value={editForm.specialite}
              onChange={(event) =>
                setEditForm({ ...editForm, specialite: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-edit-numero-order" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Numéro d&apos;ordre *
            </label>
            <Input
              id="med-edit-numero-order"
              type="text"
              maxLength={50}
              value={editForm.numeroOrder}
              onChange={(event) =>
                setEditForm({ ...editForm, numeroOrder: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-edit-tel" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Téléphone
            </label>
            <Input
              id="med-edit-tel"
              type="tel"
              maxLength={30}
              value={editForm.teliphone}
              onChange={(event) =>
                setEditForm({ ...editForm, teliphone: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="med-edit-exp" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Années d&apos;expérience *
            </label>
            <Input
              id="med-edit-exp"
              type="number"
              min={0}
              max={70}
              step={1}
              value={editForm.anneesExperience}
              onChange={(event) =>
                setEditForm({ ...editForm, anneesExperience: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="med-edit-bio" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Biographie
            </label>
            <textarea
              id="med-edit-bio"
              rows={4}
              maxLength={1000}
              value={editForm.biographie}
              onChange={(event) =>
                setEditForm({ ...editForm, biographie: event.target.value })
              }
              className="w-full rounded-lg border border-medos-line bg-white px-4 py-2.5 text-sm text-medos-ink placeholder:text-medos-slate/60 transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
            />
          </div>

          <p className="rounded-lg border border-medos-line bg-medos-frost px-4 py-3 text-xs leading-relaxed text-medos-slate">
            L&apos;email du compte d&apos;accès n&apos;est pas modifiable ici.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {isUpdating ? "Modification…" : "Enregistrer les modifications"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={closeEdit}
              disabled={isUpdating}
            >
              Annuler
            </Button>
          </div>
        </form>
      </SlideOverPanel>

      <SlideOverPanel
        open={detailsTarget !== null}
        onClose={closeDetails}
        title="Détails du médecin"
        subtitle={
          detailsTarget ? fullName(detailsTarget) : undefined
        }
      >
        {detailsData ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-xl border border-medos-line bg-medos-mist/60 px-4 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-medos-frost text-sm font-bold text-medos-teal-dark">
                {`${detailsData.prenom.charAt(0)}${detailsData.nom.charAt(0)}`.toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-medos-navy">
                  {fullName(detailsData)}
                </p>
                <p className="truncate text-xs text-medos-slate">
                  {detailsData.specialite}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-medos-teal">
                Informations professionnelles
              </h3>
              <DetailRow label="Nom" value={detailsData.nom} />
              <DetailRow label="Prénom" value={detailsData.prenom} />
              <DetailRow label="Spécialité" value={detailsData.specialite} />
              <DetailRow label="Numéro d'ordre" value={detailsData.numeroOrder} />
              <DetailRow
                label="Expérience"
                value={`${detailsData.anneesExperience} ${
                  detailsData.anneesExperience > 1 ? "années" : "année"
                }`}
              />
              <DetailRow
                label="Cabinet"
                value={detailsData.cabinetNom ?? "—"}
              />
            </div>

            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-medos-teal">
                Contact &amp; compte
              </h3>
              <DetailRow label="Téléphone" value={detailsData.teliphone ?? "—"} />
              <DetailRow
                label="Statut du compte"
                value={<AccountStatusBadge medecin={detailsData} />}
              />
              <DetailRow
                label="Email du compte"
                value={detailsData.email ?? "Aucun compte créé"}
              />
            </div>

            {detailsData.biographie && (
              <div>
                <h3 className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-medos-teal">
                  Biographie
                </h3>
                <p className="rounded-lg border border-medos-line bg-medos-mist/50 px-4 py-3 text-sm leading-relaxed text-medos-ink">
                  {detailsData.biographie}
                </p>
              </div>
            )}

            {isLoadingDetails && (
              <p className="flex items-center gap-2 text-xs text-medos-slate">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Synchronisation avec le serveur…
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="secondary"
                onClick={() => {
                  closeDetails();
                  openEdit(detailsData);
                }}
              >
                Modifier
              </Button>
              <Button variant="secondary" onClick={closeDetails}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-medos-slate">
            Chargement…
          </div>
        )}
      </SlideOverPanel>

      <SlideOverPanel
        open={accountTarget !== null}
        onClose={isCreatingAccount ? () => {} : () => setAccountTarget(null)}
        title="Créer un compte d'accès"
        subtitle={
          accountTarget
            ? `${fullName(accountTarget)} — ${accountTarget.specialite}`
            : undefined
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-medos-slate">
            Un mot de passe temporaire sera généré automatiquement et envoyé
            par email au médecin.
          </p>
          <div>
            <label htmlFor="med-account-email" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Email du compte *
            </label>
            <Input
              id="med-account-email"
              type="email"
              placeholder="email@exemple.com"
              value={accountEmail}
              onChange={(event) => setAccountEmail(event.target.value)}
              autoFocus
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button
              onClick={() => void handleCreateAccount()}
              disabled={isCreatingAccount}
            >
              {isCreatingAccount ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BadgeCheck className="h-4 w-4" />
              )}
              {isCreatingAccount ? "Création…" : "Créer le compte"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setAccountTarget(null)}
              disabled={isCreatingAccount}
            >
              Annuler
            </Button>
          </div>
        </div>
      </SlideOverPanel>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={isDeleting ? () => {} : () => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteConfirm()}
        tone="danger"
        title="Supprimer le médecin ?"
        description={
          deleteTarget ? (
            <>
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-semibold text-medos-navy">
                {fullName(deleteTarget)}
              </span>{" "}
              ?
              <br />
              Cette action peut affecter les rendez-vous, dossiers médicaux ou
              autres données associées. Le médecin sera archivé (suppression
              logique).
            </>
          ) : undefined
        }
        confirmLabel={isDeleting ? "Suppression…" : "Supprimer"}
        isPending={isDeleting}
      />

      <ConfirmDialog
        open={toggleTarget !== null}
        onClose={isToggling ? () => {} : () => setToggleTarget(null)}
        onConfirm={() => void handleToggleConfirm()}
        tone={toggleTarget?.nextActive ? "primary" : "danger"}
        title={
          toggleTarget?.nextActive
            ? "Activer le compte ?"
            : "Désactiver le compte ?"
        }
        description={
          toggleTarget ? (
            toggleTarget.nextActive ? (
              <>
                Voulez-vous activer le compte de{" "}
                <span className="font-semibold text-medos-navy">
                  {fullName(toggleTarget.medecin)}
                </span>{" "}
                ?
                <br />
                Le médecin pourra à nouveau se connecter à son espace avec ses
                identifiants.
              </>
            ) : (
              <>
                Voulez-vous vraiment désactiver le compte de{" "}
                <span className="font-semibold text-medos-navy">
                  {fullName(toggleTarget.medecin)}
                </span>{" "}
                ?
                <br />
                Le médecin ne pourra plus se connecter à son espace.
              </>
            )
          ) : undefined
        }
        confirmLabel={
          isToggling
            ? "Traitement…"
            : toggleTarget?.nextActive
              ? "Activer"
              : "Désactiver"
        }
        isPending={isToggling}
      />

      <ModalPanel
        open={importOpen}
        onClose={isImporting ? () => {} : closeImport}
        title="Importer des médecins"
        subtitle="Formats acceptés : CSV (.csv) ou Excel (.xlsx, .xls)"
      >
        {!importResult ? (
          <div className="space-y-5">
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-medos-line bg-medos-mist/40 px-4 py-8 text-center transition-colors hover:border-medos-teal/50 hover:bg-medos-frost/60">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="sr-only"
                onChange={(event) =>
                  setImportFile(event.target.files?.[0] ?? null)
                }
              />
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost">
                <FileSpreadsheet className="h-5 w-5 text-medos-teal" />
              </span>
              <span className="mt-3 block text-sm font-semibold text-medos-navy">
                {importFile ? importFile.name : "Choisissez un fichier"}
              </span>
              <span className="mt-1 block text-xs text-medos-slate">
                Cliquez pour sélectionner un fichier CSV ou Excel contenant
                plusieurs médecins.
              </span>
            </label>

            <div className="rounded-lg border border-medos-line bg-medos-mist/50 px-4 py-3 text-xs leading-relaxed text-medos-slate">
              La première ligne du fichier doit contenir les colonnes suivantes
              (dans cet ordre) :{" "}
              <span className="font-semibold text-medos-navy">
                nom, prenom, specialite, numeroOrder, teliphone, biographie,
                anneesExperience
              </span>
              . Le <span className="font-semibold">numeroOrder</span> doit être
              unique.
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={() => void handleImportFile()}
                disabled={!importFile || isImporting}
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isImporting ? "Importation…" : "Importer"}
              </Button>
              <Button
                variant="secondary"
                onClick={closeImport}
                disabled={isImporting}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-medos-line bg-medos-mist/50 p-4 text-center">
                <p className="text-2xl font-bold text-medos-navy">
                  {importResult.totalRows}
                </p>
                <p className="mt-0.5 text-xs text-medos-slate">
                  Lignes lues
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  {importResult.importes}
                </p>
                <p className="mt-0.5 text-xs text-emerald-600">
                  Médecins importés
                </p>
              </div>
            </div>

            {importResult.erreurs.length > 0 ? (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                  {importResult.erreurs.length} erreur
                  {importResult.erreurs.length > 1 ? "s" : ""}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {importResult.erreurs.map((erreur, index) => (
                    <li
                      key={index}
                      className="text-xs leading-relaxed text-red-700"
                    >
                      <span className="font-semibold">Ligne {erreur.ligne}</span>{" "}
                      : {erreur.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Toutes les lignes ont été importées avec succès.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="secondary"
                onClick={() => {
                  setImportFile(null);
                  setImportResult(null);
                }}
              >
                Importer un autre fichier
              </Button>
              <Button variant="secondary" onClick={closeImport}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </ModalPanel>

      <ModalPanel
        open={exportOpen}
        onClose={isExporting ? () => {} : () => setExportOpen(false)}
        title="Exporter les médecins"
        subtitle={`Choisissez le format du fichier (${
          medecins.length
        } ${medecins.length > 1 ? "médecins" : "médecin"} à exporter)`}
      >
        <div className="space-y-3">
          <button
            type="button"
            disabled={isExporting || medecins.length === 0}
            onClick={() => void handleExport("xlsx")}
            className="flex w-full items-center gap-3 rounded-xl border border-medos-line bg-white p-4 text-left transition-colors hover:border-medos-teal/40 hover:bg-medos-frost disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-medos-navy">
                Excel (.xlsx)
              </span>
              <span className="mt-0.5 block text-xs text-medos-slate">
                Fichier tableur Excel Open XML, compatible avec Microsoft
                Excel.
              </span>
            </span>
          </button>

          <button
            type="button"
            disabled={isExporting || medecins.length === 0}
            onClick={() => void handleExport("csv")}
            className="flex w-full items-center gap-3 rounded-xl border border-medos-line bg-white p-4 text-left transition-colors hover:border-medos-teal/40 hover:bg-medos-frost disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-medos-frost">
              <FileText className="h-5 w-5 text-medos-teal" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-medos-navy">
                CSV (.csv)
              </span>
              <span className="mt-0.5 block text-xs text-medos-slate">
                Fichier texte à valeurs séparées par des points-virgules.
              </span>
            </span>
          </button>

          {medecins.length === 0 && (
            <p className="text-xs text-medos-slate">
              Aucun médecin à exporter dans ce cabinet.
            </p>
          )}

          {isExporting && (
            <p className="flex items-center gap-2 text-xs text-medos-slate">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Téléchargement en cours…
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="secondary"
              onClick={() => setExportOpen(false)}
              disabled={isExporting}
            >
              Fermer
            </Button>
          </div>
        </div>
      </ModalPanel>
    </div>
  );
}
