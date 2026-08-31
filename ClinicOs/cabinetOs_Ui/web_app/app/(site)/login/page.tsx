"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import { login } from "@/modules/auth/service/login.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  saveAccessToken,
  saveRefreshToken,
  decodeJwtPayload,
} from "@/lib/auth-storage";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const tokens = await login({ email, password });
      saveAccessToken(tokens.access_token);
      if (tokens.refresh_token) saveRefreshToken(tokens.refresh_token);

      const payload = decodeJwtPayload(tokens.access_token);
      toast.success("Connexion réussie !");

      if (payload?.role === "ADMIN") {
        router.push("/selection-cabinet");
      } else if (payload?.role === "MEDECIN") {
        router.push("/espace-medecin");
      } else if (payload?.role === "SECRETAIRE") {
        router.push("/espace-secretaire");
      } else {
        router.push("/espace-patient");
      }
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Email ou mot de passe incorrect.")
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
            <LogIn className="h-5 w-5 text-medos-teal" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-medos-slate">
            Accédez à votre espace MedOS.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
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
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-medos-slate">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-medos-line accent-medos-teal"
              />
              Se souvenir de moi
            </label>
            <a
              href="#"
              className="text-sm font-medium text-medos-teal hover:text-medos-teal-dark"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {isSubmitting ? "Connexion en cours…" : "Se connecter"}
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
          Continuer avec Google
        </Button>

        <p className="mt-6 text-center text-sm text-medos-slate">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-medos-teal hover:text-medos-teal-dark"
          >
            Créer un compte patient
          </Link>
        </p>
      </div>
    </section>
  );
}
