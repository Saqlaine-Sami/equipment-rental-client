"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-error">Oops!</p>
      <h1 className="section-title mt-4">Something went wrong</h1>
      <p className="section-subtitle">
        An unexpected error occurred. Please try again, or go back to the home page.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </section>
  );
}