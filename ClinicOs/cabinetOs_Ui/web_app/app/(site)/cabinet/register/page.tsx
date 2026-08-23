"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Building2,
  Loader2,
  CalendarCheck,
  Users,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAdmin } from "@/modules/auth/service/register-admin.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import { saveAccessToken } from "@/lib/auth-storage";

const adminRegisterSchema = z
  .object({
    prenom: z
      .string()
      .min(2, "Le prénom est obligatoire")
      .max(50, "Le prénom ne doit pas dépasser 50 caractères"),
    nom: z
      .string()
      .min(2, "Le nom est obligatoire")
      .max(50, "Le nom ne doit pas dépasser 50 caractères"),
    email: z.email("L'email doit être valide"),
    name: z
      .string()
      .min(2, "Le nom d'utilisateur doit contenir entre 2 et 50 caractères")
      .max(50, "Le nom d'utilisateur doit contenir entre 2 et 50 caractères"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .max(100, "Le mot de passe ne doit pas dépasser 100 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
    specialite: z.string().min(1, "La spécialité est obligatoire"),
    numeroOrder: z.string().min(1, "Le numéro d'ordre est obligatoire"),
    teliphone: z
      .string()
      .min(10, "Le téléphone doit contenir entre 10 et 20 caractères")
      .max(20, "Le téléphone doit contenir entre 10 et 20 caractères"),
    Biographie: z
      .string()
      .max(1000, "La biographie ne doit pas dépasser 1000 caractères"),
    annes_experience: z
      .string()
      .min(1, "Les années d'expérience sont obligatoires")
      .refine((value) => /^\d+$/.test(value), {
        message: "Nombre entier requis",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

const STEP_1_FIELDS = [
  "prenom",
  "nom",
  "email",
  "name",
  "password",
  "confirmPassword",
] as const;

const STEPS = [
  {
    index: 1,
    label: "Compte",
    description: "Identité, email et mots de passe",
  },
  {
    index: 2,
    label: "Profil",
    description: "Spécialité, téléphone et expérience",
  },
];

const PANEL_FEATURES = [
  {
    icon: CalendarCheck,
    title: "Rendez-vous & planning",
    description: "Agenda du cabinet centralisé",
  },
  {
    icon: Users,
    title: "Médecins & secrétaires",
    description: "Gérez toute votre équipe",
  },
  {
    icon: BarChart3,
    title: "Statistiques & pilotage",
    description: "Suivez l'activité en temps réel",
  },
];

export default function CabinetAdminRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      specialite: "",
      numeroOrder: "",
      teliphone: "",
      Biographie: "",
    },
  });

  const goNext = async () => {
    const valid = await trigger([...STEP_1_FIELDS]);
    if (valid) setStep(2);
  };

  const onSubmit = async (values: AdminRegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const token = await registerAdmin({
        nom: values.nom,
        prenom: values.prenom,
        specialite: values.specialite,
        numeroOrder: values.numeroOrder,
        teliphone: values.teliphone,
        Biographie: values.Biographie ?? "",
        annes_experience: Number(values.annes_experience) || 0,
        name: values.name,
        email: values.email,
        password: values.password,
      });
      saveAccessToken(token);
      toast.success("Votre espace admin cabinet a été créé avec succès !");
      router.push("/selection-cabinet");
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de la création de votre espace."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-medos-mist px-4 pt-36 pb-16 sm:pt-40 sm:pb-20">
      <div className="w-full max-w-[1400px] overflow-hidden rounded-3xl border border-medos-line bg-white shadow-[0_8px_40px_-16px_rgba(6,59,92,0.25)] lg:grid lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr]">
        <aside className="flex flex-col justify-between gap-10 bg-medos-navy p-8 text-white sm:p-10">
          <Link href="/" aria-label="MedOS — Accueil">
            <Logo dark />
          </Link>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-medos-cyan">
              <Building2 className="h-3.5 w-3.5" />
              Espace cabinet
            </span>
            <h2 className="mt-5 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              Devenez l&apos;administrateur de votre cabinet médical
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cyan-100/75">
              Créez votre compte en deux étapes, puis pilotez rendez-vous,
              équipe et activité depuis un tableau de bord dédié.
            </p>

            <ol className="mt-8 space-y-5">
              {STEPS.map((item) => (
                <li key={item.index} className="flex items-start gap-4">
                  <span
                    className={
                      step >= item.index
                        ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-medos-teal text-sm font-bold"
                        : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-sm font-bold text-cyan-100/60"
                    }
                  >
                    {item.index}
                  </span>
                  <span>
                    <span
                      className={
                        step >= item.index
                          ? "block text-sm font-semibold"
                          : "block text-sm font-semibold text-cyan-100/60"
                      }
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-cyan-100/55">
                      {item.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <ul className="space-y-4 border-t border-white/10 pt-6">
            {PANEL_FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <feature.icon className="h-4 w-4 text-medos-cyan" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {feature.title}
                  </span>
                  <span className="text-xs text-cyan-100/60">
                    {feature.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="p-6 sm:p-10 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
              Étape {step} sur 2
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
              Créer un espace Admin de cabinet
            </h1>
            <p className="mt-1.5 text-sm text-medos-slate">
              {step === 1
                ? "Renseignez vos informations de connexion."
                : "Complétez votre profil professionnel."}
            </p>
          </div>

          <form
            className="mt-8 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {step === 1 && (
              <>
                <Field
                  label="Prénom"
                  htmlFor="prenom"
                  error={errors.prenom?.message}
                >
                  <Input size="lg"
                    id="prenom"
                    type="text"
                    placeholder="Youssef"
                    autoComplete="given-name"
                    aria-invalid={!!errors.prenom}
                    {...register("prenom")}
                  />
                </Field>

                <Field label="Nom" htmlFor="nom" error={errors.nom?.message}>
                  <Input size="lg"
                    id="nom"
                    type="text"
                    placeholder="El Amrani"
                    autoComplete="family-name"
                    aria-invalid={!!errors.nom}
                    {...register("nom")}
                  />
                </Field>

                <Field label="Email" htmlFor="email" error={errors.email?.message}>
                  <Input size="lg"
                    id="email"
                    type="email"
                    placeholder="admin@cabinet.ma"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </Field>

                <Field
                  label="Nom d'utilisateur"
                  htmlFor="name"
                  error={errors.name?.message}
                >
                  <Input size="lg"
                    id="name"
                    type="text"
                    placeholder="youssef_admin"
                    autoComplete="username"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                </Field>

                <Field
                  label="Mot de passe"
                  htmlFor="password"
                  error={errors.password?.message}
                >
                  <div className="relative">
                    <Input size="lg"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      className="pr-11"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-medos-slate transition-colors hover:text-medos-teal"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-medos-slate">
                    Au moins 6 caractères.
                  </p>
                </Field>

                <Field
                  label="Confirmer le mot de passe"
                  htmlFor="confirmPassword"
                  error={errors.confirmPassword?.message}
                >
                  <div className="relative">
                    <Input size="lg"
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      className="pr-11"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-medos-slate transition-colors hover:text-medos-teal"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <div className="sm:col-span-2 pt-2">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={goNext}
                  >
                    Continuer vers le profil
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Field
                  label="Spécialité"
                  htmlFor="specialite"
                  error={errors.specialite?.message}
                >
                  <Input size="lg"
                    id="specialite"
                    type="text"
                    placeholder="Dentiste, Généraliste…"
                    aria-invalid={!!errors.specialite}
                    {...register("specialite")}
                  />
                </Field>

                <Field
                  label="Numéro d'ordre"
                  htmlFor="numeroOrder"
                  error={errors.numeroOrder?.message}
                >
                  <Input size="lg"
                    id="numeroOrder"
                    type="text"
                    placeholder="12345"
                    aria-invalid={!!errors.numeroOrder}
                    {...register("numeroOrder")}
                  />
                </Field>

                <Field
                  label="Téléphone"
                  htmlFor="teliphone"
                  error={errors.teliphone?.message}
                >
                  <Input size="lg"
                    id="teliphone"
                    type="tel"
                    placeholder="+212600000000"
                    autoComplete="tel"
                    aria-invalid={!!errors.teliphone}
                    {...register("teliphone")}
                  />
                </Field>

                <Field
                  label="Années d'expérience"
                  htmlFor="annes_experience"
                  error={errors.annes_experience?.message}
                >
                  <Input size="lg"
                    id="annes_experience"
                    type="number"
                    min={0}
                    placeholder="5"
                    aria-invalid={!!errors.annes_experience}
                    {...register("annes_experience")}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Biographie (optionnel)"
                    htmlFor="Biographie"
                    error={errors.Biographie?.message}
                  >
                    <textarea
                      id="Biographie"
                      rows={4}
                      placeholder="Présentez votre parcours, vos centres d'intérêt médicaux…"
                      aria-invalid={!!errors.Biographie}
                      className="w-full rounded-lg border border-medos-line bg-white px-4 py-3.5 text-sm text-medos-ink placeholder:text-medos-slate/60 transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
                      {...register("Biographie")}
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row-reverse">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Création en cours…" : "Créer mon espace"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-medos-slate">
            Vous avez déjà un espace ?{" "}
            <Link
              href="/login"
              className="font-medium text-medos-teal hover:text-medos-teal-dark"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-medos-navy"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
