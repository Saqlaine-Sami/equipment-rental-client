"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";
import { SITE } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // পেজ বদলালে মোবাইল মেনু বন্ধ
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setOpen(false);
    router.push("/");
  };

  const linkClass = (href) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      pathname === href
        ? "bg-primary/10 text-primary"
        : "text-base-content/80 hover:bg-base-200 hover:text-primary"
    }`;

  const avatar = user ? (
    user.photo ? (
      <img
        src={user.photo}
        alt={user.name}
        referrerPolicy="no-referrer"
        className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30"
      />
    ) : (
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-bold text-primary-content">
        {user.name?.charAt(0).toUpperCase()}
      </span>
    )
  ) : null;

  const authSection = loading ? (
    <span className="loading loading-dots loading-sm text-primary"></span>
  ) : user ? (
    <>
      <span title={user.name}>{avatar}</span>
      <Link href="/dashboard" className="btn btn-primary btn-sm">
        Dashboard
      </Link>
      <button onClick={handleLogout} className="btn btn-outline btn-sm">
        Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className="btn btn-outline btn-sm">
        Login
      </Link>
      <Link href="/register" className="btn btn-primary btn-sm">
        Register
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between">
        {/* Logo ও নাম */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-content">
            G
          </span>
          <span className="text-xl font-extrabold tracking-tight text-base-content">
            {SITE.name}
          </span>
        </Link>

        {/* ডেস্কটপ মেনু */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{authSection}</div>

        {/* মোবাইল মেনু বাটন */}
        <button
          type="button"
          className="btn btn-ghost btn-square lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* মোবাইল মেনু */}
      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <div className="page-container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-2 border-t border-base-300 pt-4">
              {authSection}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}