"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/project";
import { Invoice } from "@/types/invoice";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Landmark, FolderOpen, MessageSquare, ArrowRight, Plus, FileText } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [stats, setStats] = useState({ projects: 0, messages: 0, revenue: 0 });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      let currentRole = "designer";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        currentRole = profile?.role ?? "designer";
      }
      setRole(currentRole);

      const fetches: any[] = [];

      if (currentRole === "owner" || currentRole === "designer") {
        fetches.push(
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(4),
        );
      } else {
        fetches.push(
          Promise.resolve({ count: 0 }),
          Promise.resolve({ data: [] }),
        );
      }

      fetches.push(
        supabase.from("messages").select("*", { count: "exact", head: true }),
      );

      if (currentRole === "owner" || currentRole === "finance") {
        fetches.push(
          supabase.from("invoices").select("total").eq("payment_status", "paid"),
          supabase.from("invoices").select("*, clients(*)").order("created_at", { ascending: false }).limit(4),
        );
      } else {
        fetches.push(
          Promise.resolve({ data: [], count: 0 }),
          Promise.resolve({ data: [] }),
        );
      }

      const [projectRes, recentProjRes, msgRes, invRes, recentInvRes] = await Promise.all(fetches);

      const revenue = (invRes.data || []).reduce((sum: number, inv: any) => sum + Number(inv.total), 0);

      setStats({
        projects: projectRes.count || 0,
        messages: msgRes.count || 0,
        revenue,
      });
      setRecentProjects(recentProjRes.data || []);
      setRecentInvoices(recentInvRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    ...((role === "owner" || role === "designer")
      ? [{ label: "Total Projects", value: stats.projects, icon: FolderOpen, color: "text-brand", href: "/dashboard/projects" as const }]
      : []),
    { label: "Pending Messages", value: stats.messages, icon: MessageSquare, color: "text-amber-600", href: "#" as const },
    ...((role === "owner" || role === "finance")
      ? [{ label: "Revenue (Paid)", value: `$${stats.revenue.toLocaleString()}`, icon: Landmark, color: "text-emerald-600", href: "/dashboard/invoices" as const }]
      : []),
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
          <p className="text-surface-500">Overview of your studio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/projects/new" className="btn-primary">
            <Plus size={20} />
            New Project
          </Link>
          <Link href="/dashboard/invoices/new" className="btn-secondary">
            <FileText size={20} />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className={`p-3 rounded-xl bg-surface-50 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-surface-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-surface-900">
                {loading ? <span className="inline-block w-16 h-6 bg-surface-100 rounded animate-pulse" /> : card.value}
              </p>
            </div>
            <ArrowRight size={18} className="text-surface-300 group-hover:text-brand transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      {(role === "owner" || role === "designer") && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-surface-900">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-brand hover:text-brand-hover font-medium flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-surface-100 rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-surface-100 rounded w-1/3" />
                    <div className="h-5 bg-surface-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="card p-8 text-center">
              <FolderOpen size={40} className="mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500 mb-4">No projects yet</p>
              <Link href="/dashboard/projects/new" className="btn-primary inline-flex">
                <Plus size={18} />
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent Invoices */}
      {(role === "owner" || role === "finance") && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-surface-900">Recent Invoices</h2>
            <Link href="/dashboard/invoices" className="text-sm text-brand hover:text-brand-hover font-medium flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse p-5 space-y-3">
                  <div className="h-4 bg-surface-100 rounded w-1/2" />
                  <div className="h-6 bg-surface-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="card p-8 text-center">
              <FileText size={40} className="mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500 mb-4">No invoices yet</p>
              <Link href="/dashboard/invoices/new" className="btn-primary inline-flex">
                <Plus size={18} />
                Create your first invoice
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="card p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-semibold text-surface-900">{inv.invoice_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${inv.payment_status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        inv.payment_status === "unpaid" ? "bg-rose-50 text-rose-700 border-rose-100" :
                          inv.payment_status === "overdue" ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                      {inv.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500">{inv.clients?.company_name}</p>
                  <p className="text-xl font-bold text-surface-900">
                    ${Number(inv.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <Link href={`/dashboard/invoices/${inv.id}`} className="text-sm text-brand hover:text-brand-hover font-medium flex items-center gap-1">
                    View details <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
