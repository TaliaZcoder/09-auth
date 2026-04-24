import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a modern app for creating, organizing and managing notes.",

  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a modern app for creating, organizing and managing notes.",
    url: "https://your-vercel-url.vercel.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          roboto.variable
        }
      >
        <TanStackProvider>
          <AuthProvider>

            <Header />

            <main>
              {children}
            </main>

            <Footer />

          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}