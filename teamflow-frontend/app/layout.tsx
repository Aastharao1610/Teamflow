import type { Metadata } from "next";
import "./globals.css";

import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "Teamflow",
  description: "Modern team collaboration and project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
