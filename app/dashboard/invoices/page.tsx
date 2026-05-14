"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Invoice, PaymentStatus } from "@/types/invoice";
import { RevenueSummary } from "@/components/invoices/RevenueSummary";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest">("newest");
  const supabase = createClient();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*, clients(*), invoice_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Invoices table not available — showing empty state");
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  const handleMarkAsPaid = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ payment_status: "paid" })
      .eq("id", id);

    if (error) {
      alert("Error updating invoice status");
    } else {
      fetchInvoices();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) {
      alert("Error deleting invoice");
    } else {
      fetchInvoices();
    }
  };

  const filteredInvoices = invoices
    .filter((inv) => {
      const matchesSearch = 
        inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        inv.clients?.company_name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.payment_status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "highest") return Number(b.total) - Number(a.total);
      return 0;
    });

  const stats = {
    total: invoices.reduce((sum, inv) => sum + Number(inv.total), 0),
    paid: invoices.filter(i => i.payment_status === 'paid').reduce((sum, inv) => sum + Number(inv.total), 0),
    pending: invoices.filter(i => i.payment_status === 'unpaid' || i.payment_status === 'partial').reduce((sum, inv) => sum + Number(inv.total), 0),
    unpaid: invoices.filter(i => i.payment_status === 'overdue').reduce((sum, inv) => sum + Number(inv.total), 0),
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Invoices</h1>
          <p className="text-surface-500">Manage your billing and revenue.</p>
        </div>
        <Link href="/dashboard/invoices/new" className="btn-primary">
          <Plus size={20} />
          Create Invoice
        </Link>
      </div>

      {/* Stats */}
      <RevenueSummary {...stats} />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input
            type="text"
            placeholder="Search by invoice number or client..."
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
            value={statusFilter}
            title="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>
          <select 
            className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
            value={sortBy}
            title="Sort by"
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Visual Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse p-5 space-y-3">
              <div className="h-4 bg-surface-100 rounded w-1/2" />
              <div className="h-6 bg-surface-100 rounded w-1/3" />
              <div className="h-3 bg-surface-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No invoices found</h3>
          <p className="text-surface-500 mb-6">
            {search || statusFilter !== "all" ? "Try different search or filter criteria." : "Get started by creating your first invoice."}
          </p>
          {!search && statusFilter === "all" && (
            <Link href="/dashboard/invoices/new" className="btn-primary inline-flex">
              <Plus size={18} />
              Create Invoice
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInvoices.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onMarkAsPaid={handleMarkAsPaid}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
