"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { auth } from "@/firebase/client";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) =>
  z.object({
    name:     type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email:    z.string().email(),
    password: z.string().min(3),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isSignIn = type === "sign-in";
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name     = fd.get("name") as string;
    const email    = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      if (!isSignIn) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({ uid: cred.user.uid, name, email, password });
        if (!result.success) { toast.error(result.message); return; }
        toast.success("Account created! Please sign in.");
        router.push("/sign-in");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();
        const result = await signIn({ email, idToken });
        if (!result?.success) { toast.error(result?.message ?? "Sign in failed."); return; }
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 md:p-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-headline-md text-on-surface mb-2">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-body-md text-on-surface-variant">
          {isSignIn
            ? "Sign in to continue your interview prep."
            : "Start practicing interviews with AI today."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {!isSignIn && (
          <div>
            <label className="input-label">Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Alex Candidate"
              className="input-field"
            />
          </div>
        )}

        <div>
          <label className="input-label">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label">Password</label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              {isSignIn ? "Signing in…" : "Creating account…"}
            </>
          ) : (
            <>{isSignIn ? "Sign In" : "Create Account"}</>
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-body-sm text-on-surface-variant text-center mt-6">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-secondary font-semibold no-underline hover:underline"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
