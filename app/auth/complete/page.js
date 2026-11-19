"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { API_URL, requestToken } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/Loading";

export default function AuthCompletePage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { data: session, isPending } = authClient.useSession();
  const started = useRef(false); // development-এ দুইবার চলা ঠেকানোর জন্য

  useEffect(() => {
    if (isPending || started.current) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    started.current = true;

    const finishLogin = async () => {
      try {
        const { name, image } = session.user;
        const email = session.user.email.toLowerCase();

        // আমাদের Server-এ user সেভ (নতুন হলে role: customer)
        const res = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, photo: image || "" }),
        });
        if (!res.ok) {
          throw new Error("Could not save your profile. Please try again.");
        }

        await requestToken(email);
        await refreshUser(email);

        toast.success("Login successful!");
        router.replace("/");
      } catch (err) {
        toast.error(err.message);
        await authClient.signOut();
        router.replace("/login");
      }
    };

    finishLogin();
  }, [session, isPending, router, refreshUser]);

  return <Loading />;
}