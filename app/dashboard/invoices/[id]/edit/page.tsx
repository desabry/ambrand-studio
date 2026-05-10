"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Invoice } from "@/types/invoice";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditInvoicePage() {
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
      .select("*, invoice_items(*)")
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

  if (loading) return <div className="p-8">Loading...</div>;
  if (!invoice) return <div className="p-8">Invoice not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/invoices/${id}`} className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Edit Invoice</h1>
          <p className="text-surface-500">Modify invoice details and items.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm">
        <InvoiceForm 
          initialData={invoice} 
          onSuccess={() => router.push(`/dashboard/invoices/${id}`)}
          onCancel={() => router.push(`/dashboard/invoices/${id}`)}
        />
      </div>
    </div>
  );
}
