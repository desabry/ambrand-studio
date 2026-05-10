"use client";

import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInvoicePage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard/invoices" className="text-surface-500 hover:text-brand transition-colors flex items-center gap-2 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Invoices
        </Link>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Create New Invoice</h1>
        <p className="text-surface-500">Fill in the details below to generate a professional invoice.</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm">
        <InvoiceForm 
          onSuccess={() => {
            router.push("/dashboard/invoices");
            router.refresh();
          }}
          onCancel={() => router.push("/dashboard/invoices")}
        />
      </div>
    </div>
  );
}
