"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Loader2,
  Pencil,
  RotateCw,
  Search,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import { getSessionUser } from "@/lib/auth-storage";
import {
  createSecretaire,
  createSecretaireAccount,
  deleteSecretaire,
  getSecretaire,
  getSecretairesByCabinet,
  searchSecretaires,
  searchSecretairesByNom,
  searchSecretairesByPrenom,
  updateSecretaire,
} from "@/modules/admin/service/secretaire.api";
import type { Secretaire } from "@/modules/admin/schema/types";
import { useSelectedCabinet } from "./use-selected-cabinet";
import { SlideOverPanel } from "./slide-over-panel";
import { ConfirmDialog } from "./confirm-dialog";
import { SecretaireActionsMenu } from "./secretaires-actions-menu";

type LoadPhase = "loading" | "ready" | "refreshing";

type FormState = {
  nom: string;
  prenom: string;
  teliphone: string;
  adress: string;
  dateEmbauche: string;
};

const emptyForm: FormState = {
  nom: "",
  prenom: "",
  teliphone: "",
  adress: "",
  dateEmbauche: "",
};

function fullName(secretaire: Secretaire): string {
  return `${secretaire.prenom} ${secretaire.nom}`;
}

function formatDateEmbauche(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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

export function SecretairesManager() {
  const cabinet = useSelectedCabinet();
  const cabinetId = cabinet?.id ?? null;
  const [secretaires, setSecretaires] = useState<Secretaire[]>([]);
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [loadedCabinetId, setLoadedCabinetId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [accountTarget, setAccountTarget] = useState<Secretaire | null>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [detailsTarget, setDetailsTarget] = useState<Secretaire | null>(null);
  const [detailsData, setDetailsData] = useState<Secretaire | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [editTarget, setEditTarget] = useState<Secretaire | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Secretaire | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [canManageAccounts, setCanManageAccounts] = useState(false);

  useEffect(() => {
    const sync = () => setCanManageAccounts(getSessionUser()?.role === "ADMIN");
    sync();
  }, []);

  const isLoading =
    phase === "loading" || (cabinetId !== null && loadedCabinetId !== cabinetId);

  const applyList = useCallback(
    (data: Secretaire[], sourceCabinetId: string) => {
      setSecretaires(data);
      setHasError(false);
      setLoadedCabinetId(sourceCabinetId);
      setPhase("ready");
    },
    []
  );

  useEffect(() => {
    if (!cabinetId) return;
    let cancelled = false;
    const resetForCabinet = () => {
      setSearchNom("");
      setSearchPrenom("");
      setIsSearchActive(false);
    };
    resetForCabinet();
    getSecretairesByCabinet(cabinetId)
      .then((data) => {
        if (!cancelled) applyList(data, cabinetId);
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
  }, [cabinetId, applyList]);

  const reloadSecretaires = useCallback(async () => {
    if (!cabinetId) return;
    setIsSearchActive(false);
    setSearchNom("");
    setSearchPrenom("");
    setPhase("refreshing");
    try {
      const data = await getSecretairesByCabinet(cabinetId);
      setSecretaires(data);
      setHasError(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Impossible de charger les secrétaires.")
      );
    } finally {
      setPhase("ready");
    }
  }, [cabinetId]);

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cabinetId) return;

    const nom = searchNom.trim();
    const prenom = searchPrenom.trim();

    if (!nom && !prenom) {
      await reloadSecretaires();
      return;
    }

    setIsSearching(true);
    try {
      let data: Secretaire[];
      if (nom && prenom) {
        data = await searchSecretaires(nom, prenom);
      } else if (nom) {
        data = await searchSecretairesByNom(nom);
      } else {
        data = await searchSecretairesByPrenom(prenom);
      }
      setSecretaires(data);
      setHasError(false);
      setIsSearchActive(true);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "La recherche a échoué.")
      );
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    void reloadSecretaires();
  };

  const closeAddPanel = useCallback(() => {
    setAddPanelOpen(false);
    setForm(emptyForm);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cabinetId) return;

    if (form.nom.trim().length < 2 || form.prenom.trim().length < 2) {
      toast.error("Le nom et le prénom de la secrétaire sont obligatoires.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSecretaire({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        teliphone: form.teliphone.trim() || null,
        adress: form.adress.trim() || null,
        dateEmbauche: form.dateEmbauche
          ? `${form.dateEmbauche}T00:00:00`
          : null,
        cabinetId,
      });
      toast.success(`Secrétaire ${form.nom.trim()} ajoutée avec succès.`);
      closeAddPanel();
      await reloadSecretaires();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de la création de la secrétaire."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!accountTarget) return;
    const email = accountEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Veuillez saisir une adresse email valide.");
      return;
    }

    setIsCreatingAccount(true);
    try {
      const message = await createSecretaireAccount({
        secretaireId: accountTarget.id,
        email,
      });
      toast.success(message || "Compte créé avec succès.");
      setAccountTarget(null);
      setAccountEmail("");
      await reloadSecretaires();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de créer le compte de cette secrétaire."
        )
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const openDetails = useCallback(async (secretaire: Secretaire) => {
    setDetailsTarget(secretaire);
    setDetailsData(secretaire);
    setIsLoadingDetails(true);
    try {
      const fresh = await getSecretaire(secretaire.id);
      setDetailsData(fresh);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de charger les détails de la secrétaire."
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

  const openEdit = useCallback((secretaire: Secretaire) => {
    setEditTarget(secretaire);
    setEditForm({
      nom: secretaire.nom ?? "",
      prenom: secretaire.prenom ?? "",
      teliphone: secretaire.teliphone ?? "",
      adress: secretaire.adress ?? "",
      dateEmbauche: secretaire.dateEmbauche
        ? secretaire.dateEmbauche.slice(0, 10)
        : "",
    });
  }, []);

  const closeEdit = useCallback(() => {
    setEditTarget(null);
    setEditForm(emptyForm);
  }, []);

  const handleUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTarget) return;

    if (
      editForm.nom.trim().length < 2 ||
      editForm.prenom.trim().length < 2
    ) {
      toast.error("Le nom et le prénom de la secrétaire sont obligatoires.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateSecretaire({
        id: editTarget.id,
        nom: editForm.nom.trim(),
        prenom: editForm.prenom.trim(),
        teliphone: editForm.teliphone.trim() || null,
        adresse: editForm.adress.trim() || null,
        dateEmbauche: editForm.dateEmbauche
          ? `${editForm.dateEmbauche}T00:00:00`
          : null,
      });
      toast.success(`${fullName(editTarget)} modifiée avec succès.`);
      closeEdit();
      await reloadSecretaires();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de la modification."
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
      await deleteSecretaire(deleteTarget.id);
      toast.success(`${fullName(deleteTarget)} supprimée avec succès.`);
      setDeleteTarget(null);
      await reloadSecretaires();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de supprimer cette secrétaire."
        )
      );
    } finally {
      setIsDeleting(false);
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
          pour commencer à ajouter vos secrétaires.
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
          <span className="font-semibold text-medos-navy">{cabinet.nom}</span> ·{" "}
          {secretaires.length === 0
            ? "aucune secrétaire"
            : `${secretaires.length} ${
                secretaires.length > 1 ? "secrétaires" : "secrétaire"
              }`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void reloadSecretaires()}
            disabled={phase === "refreshing"}
          >
            <RotateCw
              className={
                phase === "refreshing" ? "h-4 w-4 animate-spin" : "h-4 w-4"
              }
            />
            Actualiser
          </Button>
          <Button size="sm" onClick={() => setAddPanelOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Nouvelle secrétaire
          </Button>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSearchSubmit(event);
        }}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-medos-line bg-white p-4 shadow-sm"
      >
        <div className="min-w-40 flex-1">
          <label
            htmlFor="sec-search-nom"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-medos-slate"
          >
            Nom
          </label>
          <Input
            id="sec-search-nom"
            type="text"
            placeholder="Rechercher par nom…"
            maxLength={100}
            value={searchNom}
            onChange={(event) => setSearchNom(event.target.value)}
          />
        </div>
        <div className="min-w-40 flex-1">
          <label
            htmlFor="sec-search-prenom"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-medos-slate"
          >
            Prénom
          </label>
          <Input
            id="sec-search-prenom"
            type="text"
            placeholder="Rechercher par prénom…"
            maxLength={100}
            value={searchPrenom}
            onChange={(event) => setSearchPrenom(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Rechercher
          </Button>
          {isSearchActive && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetSearch}
              disabled={phase === "refreshing" || isSearching}
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </form>

      {hasError && secretaires.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-medos-line bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-medos-navy">
            Impossible de charger les secrétaires de ce cabinet.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => void reloadSecretaires()}
            disabled={phase === "refreshing"}
          >
            Réessayer
          </Button>
        </div>
      ) : isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-medos-line bg-white" />
      ) : secretaires.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <UserRound className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            {isSearchActive
              ? "Aucun résultat pour cette recherche"
              : "Aucune secrétaire dans ce cabinet"}
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-medos-slate">
            {isSearchActive
              ? "Essayez avec d'autres termes ou réinitialisez la recherche."
              : "Ajoutez une secrétaire pour gérer l'accueil et les rendez-vous du cabinet."}
          </p>
          {isSearchActive ? (
            <Button variant="secondary" onClick={resetSearch} className="mt-5">
              Réinitialiser la recherche
            </Button>
          ) : (
            <Button onClick={() => setAddPanelOpen(true)} className="mt-5">
              <UserPlus className="h-4 w-4" />
              Ajouter une secrétaire
            </Button>
          )}
        </div>
      ) : (
        <section className="rounded-2xl border border-medos-line bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-medos-line px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-medos-navy">
                {isSearchActive
                  ? "Résultats de la recherche"
                  : "Liste des secrétaires"}
              </h2>
              <p className="text-xs text-medos-slate">
                {secretaires.length}{" "}
                {secretaires.length > 1
                  ? "secrétaires trouvées"
                  : "secrétaire trouvée"}
              </p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-medos-line bg-medos-mist/60 text-xs uppercase tracking-wide text-medos-slate">
                  <th className="px-5 py-3 font-semibold">Secrétaire</th>
                  <th className="px-5 py-3 font-semibold">Téléphone</th>
                  <th className="px-5 py-3 font-semibold">Adresse</th>
                  <th className="px-5 py-3 font-semibold">Embauche</th>
                  <th className="px-5 py-3 font-semibold">Compte</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {secretaires.map((secretaire) => (
                  <tr
                    key={secretaire.id}
                    className="border-b border-medos-line/60 last:border-0 transition-colors hover:bg-medos-frost/50"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-medos-frost text-xs font-bold text-medos-teal-dark">
                          {`${secretaire.prenom.charAt(0)}${secretaire.nom.charAt(0)}`.toUpperCase()}
                        </span>
                        <span className="font-semibold text-medos-navy">
                          {fullName(secretaire)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-medos-slate">
                      {secretaire.teliphone ?? "—"}
                    </td>
                    <td className="max-w-52 truncate px-5 py-3.5 text-medos-slate">
                      {secretaire.adress ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {secretaire.dateEmbauche ? (
                        <span className="inline-flex items-center gap-1.5 text-medos-slate">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          {formatDateEmbauche(secretaire.dateEmbauche)}
                        </span>
                      ) : (
                        <span className="text-medos-slate">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          secretaire.email
                            ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                            : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500"
                        }
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {secretaire.email ? "Actif" : "Sans compte"}
                      </span>
                      {secretaire.email && (
                        <span className="mt-1 block max-w-48 truncate text-xs text-medos-slate">
                          {secretaire.email}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <SecretaireActionsMenu
                          secretaire={secretaire}
                          canManageAccounts={canManageAccounts}
                          actions={{
                            onView: () => void openDetails(secretaire),
                            onEdit: () => openEdit(secretaire),
                            onCreateAccount: () => {
                              setAccountTarget(secretaire);
                              setAccountEmail("");
                            },
                            onDelete: () => setDeleteTarget(secretaire),
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <SlideOverPanel
        open={addPanelOpen}
        onClose={isSubmitting ? () => {} : closeAddPanel}
        title="Nouvelle secrétaire"
        subtitle={`Ajout au cabinet : ${cabinet.nom}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sec-nom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Nom *
            </label>
            <Input
              id="sec-nom"
              type="text"
              placeholder="Benali"
              maxLength={100}
              value={form.nom}
              onChange={(event) => setForm({ ...form, nom: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="sec-prenom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Prénom *
            </label>
            <Input
              id="sec-prenom"
              type="text"
              placeholder="Salma"
              maxLength={100}
              value={form.prenom}
              onChange={(event) =>
                setForm({ ...form, prenom: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="sec-tel" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Téléphone
            </label>
            <Input
              id="sec-tel"
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
            <label htmlFor="sec-date" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Date d&apos;embauche
            </label>
            <Input
              id="sec-date"
              type="date"
              value={form.dateEmbauche}
              onChange={(event) =>
                setForm({ ...form, dateEmbauche: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="sec-adress" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Adresse
            </label>
            <Input
              id="sec-adress"
              type="text"
              placeholder="Quartier Maârif, rue X, Casablanca"
              maxLength={200}
              value={form.adress}
              onChange={(event) =>
                setForm({ ...form, adress: event.target.value })
              }
            />
          </div>

          <p className="rounded-lg border border-medos-line bg-medos-frost px-4 py-3 text-xs leading-relaxed text-medos-slate">
            Après l&apos;ajout, créez le compte d&apos;accès depuis la colonne
            « Action » du tableau : un mot de passe temporaire sera généré
            automatiquement.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isSubmitting ? "Ajout…" : "Ajouter la secrétaire"}
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
        title="Modifier la secrétaire"
        subtitle={
          editTarget ? `${fullName(editTarget)} — Cabinet : ${cabinet.nom}` : undefined
        }
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label htmlFor="sec-edit-nom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Nom *
            </label>
            <Input
              id="sec-edit-nom"
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
            <label htmlFor="sec-edit-prenom" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Prénom *
            </label>
            <Input
              id="sec-edit-prenom"
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
            <label htmlFor="sec-edit-tel" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Téléphone
            </label>
            <Input
              id="sec-edit-tel"
              type="tel"
              maxLength={30}
              value={editForm.teliphone}
              onChange={(event) =>
                setEditForm({ ...editForm, teliphone: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="sec-edit-date" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Date d&apos;embauche
            </label>
            <Input
              id="sec-edit-date"
              type="date"
              value={editForm.dateEmbauche}
              onChange={(event) =>
                setEditForm({ ...editForm, dateEmbauche: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="sec-edit-adress" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Adresse
            </label>
            <Input
              id="sec-edit-adress"
              type="text"
              maxLength={200}
              value={editForm.adress}
              onChange={(event) =>
                setEditForm({ ...editForm, adress: event.target.value })
              }
            />
          </div>

          <p className="rounded-lg border border-medos-line bg-medos-frost px-4 py-3 text-xs leading-relaxed text-medos-slate">
            L&apos;email du compte d&apos;accès et le cabinet de rattachement
            ne sont pas modifiables ici.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
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
        title="Détails de la secrétaire"
        subtitle={detailsTarget ? fullName(detailsTarget) : undefined}
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
                  {cabinet.nom}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-medos-teal">
                Informations personnelles
              </h3>
              <DetailRow label="Nom" value={detailsData.nom} />
              <DetailRow label="Prénom" value={detailsData.prenom} />
              <DetailRow label="Téléphone" value={detailsData.teliphone ?? "—"} />
              <DetailRow label="Adresse" value={detailsData.adress ?? "—"} />
              <DetailRow
                label="Date d'embauche"
                value={
                  detailsData.dateEmbauche
                    ? formatDateEmbauche(detailsData.dateEmbauche)
                    : "—"
                }
              />
            </div>

            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-medos-teal">
                Compte d&apos;accès
              </h3>
              <DetailRow
                label="Statut"
                value={
                  detailsData.email ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                      Sans compte
                    </span>
                  )
                }
              />
              <DetailRow
                label="Email du compte"
                value={detailsData.email ?? "Aucun compte créé"}
              />
            </div>

            {isLoadingDetails && (
              <p className="flex items-center gap-2 text-xs text-medos-slate">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Synchronisation avec le serveur…
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              {!detailsData.email && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    closeDetails();
                    setAccountTarget(detailsData);
                    setAccountEmail("");
                  }}
                >
                  Créer un compte
                </Button>
              )}
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
          accountTarget ? fullName(accountTarget) : undefined
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-medos-slate">
            Un mot de passe temporaire sera généré automatiquement et envoyé
            par email à la secrétaire.
          </p>
          <div>
            <label htmlFor="sec-account-email" className="mb-1.5 block text-sm font-medium text-medos-navy">
              Email du compte *
            </label>
            <Input
              id="sec-account-email"
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
        title="Supprimer la secrétaire ?"
        description={
          deleteTarget ? (
            <>
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-semibold text-medos-navy">
                {fullName(deleteTarget)}
              </span>{" "}
              ?
              <br />
              La secrétaire sera archivée (suppression logique) et disparaîtra
              de la liste du cabinet.
            </>
          ) : undefined
        }
        confirmLabel={isDeleting ? "Suppression…" : "Supprimer"}
        isPending={isDeleting}
      />
    </div>
  );
}
