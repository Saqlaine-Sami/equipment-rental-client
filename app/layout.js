import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";
import { SITE } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${SITE.name} | Equipment Rental Platform`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="gearhaven" className={jakarta.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <AuthProvider>
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}