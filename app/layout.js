import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Equipment Rental Platform",
  description:
    "Rent the equipment you need or list your own. A secure marketplace connecting equipment owners and customers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}