"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { requestToken } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");

    setLoading(true);
    try {
      // ১. BetterAuth দিয়ে login
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      // ২. JWT token নেওয়া। না পেলে login বাতিল
      try {
        await requestToken(data.user.email);
      } catch (tokenError) {
        await authClient.signOut();
        toast.error(tokenError.message);
        return;
      }
      await refreshUser(data.user.email);

      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <form onSubmit={handleLogin} className="card-body gap-2">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-center text-sm opacity-70 mb-2">
            Login to your account
          </p>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              name="email"
              className="input w-full"
              placeholder="you@example.com"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              name="password"
              className="input w-full"
              placeholder="Your password"
              required
            />
          </fieldset>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Login"}
          </button>

          <p className="text-center text-sm mt-2">
            New here?{" "}
            <Link href="/register" className="link link-primary">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}