import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "Invoice Management | Ambrand Studio",
  description: "Professional invoice management for Ambrand Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-surface-50 min-h-screen")}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Placeholder for now */}
          <aside className="w-64 bg-white border-r border-surface-200 hidden md:flex flex-col">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
                <span className="font-bold text-xl text-surface-900 tracking-tight">Ambrand</span>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-surface-600 hover:text-brand hover:bg-brand-light rounded-lg transition-colors">
                <span>Dashboard</span>
              </a>
              <a href="/dashboard/invoices" className="flex items-center gap-3 px-3 py-2 text-brand bg-brand-light font-medium rounded-lg transition-colors">
                <span>Invoices</span>
              </a>
              {/* Add more links as needed */}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
