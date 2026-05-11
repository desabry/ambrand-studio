"use client";

import { Invoice } from "@/types/invoice";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { Eye, Edit, CheckCircle, Download, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { format } from "date-fns";

interface Props {
  invoice: Invoice;
  onMarkAsPaid?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

export function InvoiceCard({ invoice, onMarkAsPaid, onDelete }: Props) {
  return (
    <div className="group bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all duration-300 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} className="text-surface-400" />
            <span className="text-sm font-mono font-semibold text-surface-900">{invoice.invoice_number}</span>
          </div>
          <p className="text-sm text-surface-500">{invoice.clients?.company_name}</p>
        </div>
        <InvoiceStatusBadge status={invoice.payment_status} />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-surface-900">
          ${Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Due date */}
      <div className="text-xs text-surface-500 mb-4">
        Due {format(new Date(invoice.due_date), "MMM d, yyyy")}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 pt-3 border-t border-surface-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/dashboard/invoices/${invoice.id}`}
          className="p-2 text-surface-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all"
          title="View"
        >
          <Eye size={16} />
        </Link>
        <Link
          href={`/dashboard/invoices/${invoice.id}/edit`}
          className="p-2 text-surface-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all"
          title="Edit"
        >
          <Edit size={16} />
        </Link>
        {invoice.payment_status !== "paid" && onMarkAsPaid && (
          <button
            onClick={() => onMarkAsPaid(invoice.id)}
            className="p-2 text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Mark as Paid"
          >
            <CheckCircle size={16} />
          </button>
        )}
        <PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName={`Invoice-${invoice.invoice_number}.pdf`}>
          {({ loading }) => (
            <button
              className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all"
              title="Download PDF"
              disabled={loading}
            >
              <Download size={16} />
            </button>
          )}
        </PDFDownloadLink>
        {onDelete && (
          <button
            onClick={() => onDelete(invoice.id)}
            className="p-2 text-surface-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
