import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Removed",
  description: "This site has been redacted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-4xl p-8">
          <header className="mb-6">
            <h1 className="text-xl font-bold">Website Content Removed</h1>
          </header>
          <main>{children}</main>
          <footer className="mt-10 text-sm text-slate-500">©</footer>
        </div>
      </body>
    </html>
  );
}
