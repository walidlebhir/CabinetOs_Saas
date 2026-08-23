"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import { registerPatient } from "@/modules/auth/service/register.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import { saveAccessToken } from "@/lib/auth-storage";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await registerPatient({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });
      saveAccessToken(token);
      toast.success("Votre compte patient a été créé avec succès !");
      router.push("/espace-patient");
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Une erreur est survenue lors de la création de votre compte."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-medos-mist px-4 py-32">
      <div className="w-full max-w-xl rounded-2xl border border-medos-line bg-white p-8 shadow-[0_8px_40px_-16px_rgba(6,59,92,0.25)] sm:p-12">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <UserPlus className="h-5 w-5 text-medos-teal" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
            Créer un compte patient
          </h1>
          <p className="mt-2 text-sm text-medos-slate">
            Réservez vos rendez-vous et suivez vos dossiers en ligne.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-sm font-medium text-medos-navy"
              >
                Prénom
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jean"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-sm font-medium text-medos-navy"
              >
                Nom
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Dupont"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-medos-navy"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.fr"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-medos-navy"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="pr-11"
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
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-medos-navy"
              >
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 text-sm text-medos-slate">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-0.5 h-4 w-4 rounded border-medos-line accent-medos-teal"
            />
            <span>
              J&apos;accepte les{" "}
              <a
                href="#"
                className="font-medium text-medos-teal hover:text-medos-teal-dark"
              >
                conditions d&apos;utilisation
              </a>{" "}
              et la politique de confidentialité.
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {isSubmitting ? "Création en cours…" : "Créer mon compte"}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-medos-line" />
          <span className="text-xs font-medium uppercase tracking-wider text-medos-slate">
            ou
          </span>
          <span className="h-px flex-1 bg-medos-line" />
        </div>

        <Button variant="secondary" size="lg" className="mt-6 w-full">
          <GoogleIcon className="h-5 w-5" />
          S&apos;inscrire avec Google
        </Button>

        <p className="mt-6 text-center text-sm text-medos-slate">
          Déjà inscrit ?{" "}
          <Link
            href="/login"
            className="font-medium text-medos-teal hover:text-medos-teal-dark"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}
