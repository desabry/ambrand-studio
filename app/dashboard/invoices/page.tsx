"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Download, MoreVertical, Eye, Trash2, CheckCircle, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Invoice, PaymentStatus } from "@/types/invoice";
import { RevenueSummary } from "@/components/invoices/RevenueSummary";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { format } from "date-fns";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoices/InvoicePDF";

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
      console.error("Error fetching invoices:", error);
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

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Invoice Number</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-4 bg-surface-100 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-surface-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-surface-900">{inv.invoice_number}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-surface-900 font-medium">{inv.clients?.company_name}</span>
                      <span className="text-xs text-surface-500">{inv.clients?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-surface-900">
                    ${Number(inv.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <InvoiceStatusBadge status={inv.payment_status} />
                  </td>
                  <td className="px-6 py-4 text-surface-600 text-sm">
                    {format(new Date(inv.due_date), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/invoices/${inv.id}`} className="p-2 text-surface-500 hover:text-brand hover:bg-brand-light rounded-lg transition-all" title="View">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/dashboard/invoices/${inv.id}/edit`} className="p-2 text-surface-500 hover:text-brand hover:bg-brand-light rounded-lg transition-all" title="Edit">
                        <Edit size={18} />
                      </Link>
                      {inv.payment_status !== 'paid' && (
                        <button 
                          onClick={() => handleMarkAsPaid(inv.id)}
                          className="p-2 text-surface-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                          title="Mark as Paid"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <PDFDownloadLink document={<InvoicePDF invoice={inv} />} fileName={`Invoice-${inv.invoice_number}.pdf`}>
                        {({ loading }) => (
                          <button className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-all" title="Download PDF" disabled={loading}>
                            <Download size={18} />
                          </button>
                        )}
                      </PDFDownloadLink>
                      <button 
                        onClick={() => handleDelete(inv.id)}
                        className="p-2 text-surface-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
