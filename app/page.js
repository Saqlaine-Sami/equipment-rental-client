"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    clearToken();
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Equipment Rental Platform</h1>

        {isPending ? (
          <span className="loading loading-spinner"></span>
        ) : session ? (
          <>
            <p>
              Logged in as <b>{session.user.name}</b> ({session.user.email})
            </p>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="btn btn-primary">Login</Link>
            <Link href="/register" className="btn btn-outline">Register</Link>
          </div>
        )}
      </div>
    </main>
  );
}