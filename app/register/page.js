"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { API_URL, requestToken } from "@/lib/api";
import { validatePassword } from "@/lib/validators";
import { useAuth } from "@/components/AuthProvider";
import GoogleButton from "@/components/GoogleButton";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim().toLowerCase();
    const photo = formData.get("photo").trim();
    const password = formData.get("password");

    // Password-এর নিয়ম না মিললে error toast
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      // ১. BetterAuth-এ account তৈরি
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photo,
      });
      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      // ২. আমাদের Server-এ user সেভ (role সবসময় customer)
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, photo }),
      });
      if (!res.ok) {
        throw new Error("Could not save your profile. Please try again.");
      }

      // ৩. JWT token নেওয়া
      await requestToken(email);
      await refreshUser(email);

      toast.success("Registration successful!");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <main className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <form onSubmit={handleRegister} className="card-body gap-2">
          <h1 className="text-2xl font-bold text-center">Create your account</h1>
          <p className="text-center text-sm opacity-70 mb-2">
            Register to rent or list equipment
          </p>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Your full name"
              required
            />
          </fieldset>

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
            <legend className="fieldset-legend">Photo URL</legend>
            <input
              type="url"
              name="photo"
              className="input w-full"
              placeholder="https://example.com/your-photo.jpg"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              name="password"
              className="input w-full"
              placeholder="At least 6 characters"
              required
            />
            <p className="label">Must include an uppercase and a lowercase letter</p>
          </fieldset>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Register"}
          </button>

          {/* নতুন: এই তিন লাইন */}
          <div className="divider text-sm">OR</div>
          <GoogleButton />

          
          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}