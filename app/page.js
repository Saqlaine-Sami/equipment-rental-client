"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, loading, logout } = useAuth();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Equipment Rental Platform</h1>

        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : user ? (
          <>
            <p>
              Logged in as <b>{user.name}</b> ({user.email})
            </p>
            <p>
              Role: <span className="badge badge-primary">{user.role}</span>
            </p>
            <button onClick={logout} className="btn btn-outline">
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