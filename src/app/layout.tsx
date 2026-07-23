import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistem Warga RW 14",
  description: "Sistem Pencatatan Kependudukan Warga RW 14",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}

        <Toaster
          richColors
          position="top-right"
          closeButton
        />
      </body>
    </html>
  );
}