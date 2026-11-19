import Link from "next/link";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <section className="page-container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="section-title mt-4">Page not found</h1>
      <p className="section-subtitle">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to Home
      </Link>
    </section>
  );
}