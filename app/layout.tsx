import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard | Ambrand Studio",
  description: "Ambrand Studio management dashboard",
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span>Dashboard</span>
              </a>
              <a href="/dashboard/projects" className="flex items-center gap-3 px-3 py-2 text-surface-600 hover:text-brand hover:bg-brand-light rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h6.9c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V3.6c0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5Z"/><path d="M9 7h1"/><path d="M9 10.5h1"/><path d="M9 14h1"/></svg>
                <span>Projects</span>
              </a>
              <a href="/dashboard/invoices" className="flex items-center gap-3 px-3 py-2 text-surface-600 hover:text-brand hover:bg-brand-light rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <span>Invoices</span>
              </a>
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
