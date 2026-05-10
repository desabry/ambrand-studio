"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Invoice } from "@/types/invoice";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { InvoicePDF } from "@/components/invoices/InvoicePDF";
import { format } from "date-fns";
import { ArrowLeft, Download, Mail, Printer, Edit, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, clients(*), invoice_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching invoice:", error);
      router.push("/dashboard/invoices");
    } else {
      setInvoice(data);
    }
    setLoading(false);
  };

  const deleteInvoice = async () => {
    if (!confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;

    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) {
      alert("Error deleting invoice");
    } else {
      router.push("/dashboard/invoices");
    }
  };

  const markAsPaid = async () => {
    const { error } = await supabase
      .from("invoices")
      .update({ payment_status: "paid" })
      .eq("id", id);

    if (!error) fetchInvoice();
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!invoice) return <div className="p-8">Invoice not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/invoices" className="text-surface-500 hover:text-brand transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Invoices
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="btn-secondary text-sm">
            <Printer size={16} /> Print
          </button>
          <PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName={`Invoice-${invoice.invoice_number}.pdf`}>
            {({ loading }) => (
              <button className="btn-secondary text-sm" disabled={loading}>
                <Download size={16} /> {loading ? "Generating..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
          <button className="btn-secondary text-sm">
            <Mail size={16} /> Send
          </button>
          {invoice.payment_status !== 'paid' && (
            <button onClick={markAsPaid} className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle size={16} /> Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Header */}
        <div className="p-8 md:p-12 bg-surface-50 border-b border-surface-200 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-2xl">A</div>
              <span className="font-bold text-2xl text-surface-900 tracking-tight">Ambrand Studio</span>
            </div>
            <div className="text-surface-500 text-sm space-y-1">
              <p>Professional Branding & Design Agency</p>
              <p>hello@ambrand.studio</p>
              <p>www.ambrand.studio</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <h2 className="text-4xl font-black text-surface-900 opacity-10 uppercase tracking-widest">Invoice</h2>
            <p className="text-surface-900 font-bold text-lg">#{invoice.invoice_number}</p>
            <InvoiceStatusBadge status={invoice.payment_status} className="text-sm px-4 py-1" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Billed To</h3>
              <p className="text-xl font-bold text-surface-900">{invoice.clients?.company_name}</p>
              <p className="text-surface-600 font-medium mt-1">{invoice.clients?.contact_person}</p>
              <p className="text-surface-500 text-sm">{invoice.clients?.email}</p>
              <p className="text-surface-500 text-sm mt-2">{invoice.clients?.country}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Invoice Date</h3>
              <p className="font-bold text-surface-900">{format(new Date(invoice.created_at), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Due Date</h3>
              <p className="font-bold text-brand">{format(new Date(invoice.due_date), "MMMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 md:px-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-surface-900">
                <th className="py-4 text-sm font-black text-surface-900 uppercase">Description</th>
                <th className="py-4 text-sm font-black text-surface-900 uppercase text-center w-24">Qty</th>
                <th className="py-4 text-sm font-black text-surface-900 uppercase text-right w-32">Unit Price</th>
                <th className="py-4 text-sm font-black text-surface-900 uppercase text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {invoice.invoice_items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-6">
                    <p className="font-bold text-surface-900">{item.item_name}</p>
                    <p className="text-sm text-surface-500 mt-1">{item.description}</p>
                  </td>
                  <td className="py-6 text-center text-surface-900 font-medium">{item.quantity}</td>
                  <td className="py-6 text-right text-surface-900 font-medium">${Number(item.unit_price).toFixed(2)}</td>
                  <td className="py-6 text-right text-surface-900 font-bold">${Number(item.total_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="p-8 md:p-12 flex justify-end">
          <div className="w-full md:w-80 space-y-4">
            <div className="flex justify-between text-surface-500 font-medium">
              <span>Subtotal</span>
              <span>${Number(invoice.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-surface-500 font-medium">
              <span>Tax (10%)</span>
              <span>${Number(invoice.tax).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-4 border-t-2 border-surface-900 flex justify-between items-center">
              <span className="text-xl font-black text-surface-900 uppercase">Total</span>
              <span className="text-3xl font-black text-brand">${Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="p-8 md:p-12 bg-surface-50 border-t border-surface-200">
            <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Notes & Terms</h3>
            <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <div className="flex items-center justify-end gap-4 print:hidden">
        <Link href={`/dashboard/invoices/${id}/edit`} className="text-surface-500 hover:text-surface-900 transition-colors flex items-center gap-2 font-medium">
          <Edit size={18} /> Edit Invoice
        </Link>
        <button onClick={deleteInvoice} className="text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-2 font-medium">
          <Trash2 size={18} /> Delete Invoice
        </button>
      </div>
    </div>
  );
}
