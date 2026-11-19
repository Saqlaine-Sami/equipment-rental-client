"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/Loading";

// roles দিলে শুধু ওই role-এর user ঢুকতে পারবে, যেমন roles={["admin"]}
export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const allowed = user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (loading) return; // যাচাই শেষ না হওয়া পর্যন্ত কিছু করা হবে না

    if (!user) {
      router.replace("/login");
    } else if (!allowed) {
      router.replace("/");
    }
  }, [loading, user, allowed, router]);

  if (loading || !allowed) return <Loading />;

  return children;
}