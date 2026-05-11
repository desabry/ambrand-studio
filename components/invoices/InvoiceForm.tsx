"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, Calculator } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Client, InvoiceItem, PaymentStatus } from "@/types/invoice";
import { cn } from "@/lib/cn";

interface Props {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InvoiceForm({ initialData, onSuccess, onCancel }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(initialData?.client_id || "");
  const [dueDate, setDueDate] = useState(initialData?.due_date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [taxRate, setTaxRate] = useState(10); // Default 10%
  const [items, setItems] = useState<InvoiceItem[]>(initialData?.invoice_items || [
    { item_name: "", description: "", quantity: 1, unit_price: 0, total_price: 0 }
  ]);

  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("company_name");
    setClients(data || []);
  };

  const addItem = () => {
    setItems([...items, { item_name: "", description: "", quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    if (field === "quantity" || field === "unit_price") {
      item.total_price = Number(item.quantity) * Number(item.unit_price);
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        // 1. Update Invoice
        const { error: invError } = await supabase
          .from("invoices")
          .update({
            client_id: clientId,
            subtotal,
            tax: taxAmount,
            total,
            due_date: dueDate,
            notes,
          })
          .eq("id", initialData.id);

        if (invError) throw invError;

        // 2. Update Items (Delete and Re-insert is often cleaner for complex nested items)
        const { error: delError } = await supabase.from("invoice_items").delete().eq("invoice_id", initialData.id);
        if (delError) throw delError;

        const itemsToInsert = items.map(item => ({
          item_name: item.item_name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          invoice_id: initialData.id
        }));

        const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert);
        if (itemsError) throw itemsError;

      } else {
        // 1. Create Invoice
        const { data: invoice, error: invError } = await supabase
          .from("invoices")
          .insert({
            client_id: clientId,
            subtotal,
            tax: taxAmount,
            total,
            due_date: dueDate,
            notes,
            payment_status: "unpaid"
          })
          .select()
          .single();

        if (invError) throw invError;

        // 2. Create Invoice Items
        const itemsToInsert = items.map(item => ({
          item_name: item.item_name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          invoice_id: invoice.id
        }));

        const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-surface-700">Select Client</label>
          <select
            required
            title="Select Client"
            className="w-full px-4 py-2 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Select a client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-surface-700">Due Date</label>
          <input
            type="date"
            required
            title="Due Date"
            className="w-full px-4 py-2 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-surface-900">Invoice Items</h3>
          <button type="button" onClick={addItem} className="text-brand hover:text-brand-hover text-sm font-medium flex items-center gap-1">
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="border border-surface-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase">Service/Item</th>
                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase w-20">Qty</th>
                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase w-32">Price</th>
                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase w-32">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <input
                      required
                      placeholder="Service name..."
                      className="w-full bg-transparent outline-none text-surface-900 font-medium placeholder:text-surface-300"
                      value={item.item_name}
                      onChange={(e) => updateItem(index, "item_name", e.target.value)}
                    />
                    <input
                      placeholder="Add description..."
                      className="w-full bg-transparent outline-none text-xs text-surface-500 placeholder:text-surface-300 mt-1"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      required
                      min="1"
                      title="Quantity"
                      className="w-full bg-transparent outline-none text-surface-900"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      title="Unit Price"
                      className="w-full bg-transparent outline-none text-surface-900"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-3 text-surface-900 font-bold">
                    ${item.total_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => removeItem(index)} className="text-surface-400 hover:text-rose-600 transition-colors" title="Remove Item">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary and Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-surface-700">Notes / Payment Terms</label>
          <textarea
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none h-32 resize-none"
            placeholder="Add any specific instructions or terms..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="bg-surface-50 p-6 rounded-xl space-y-4">
          <div className="flex justify-between text-surface-600">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-surface-600">
            <div className="flex items-center gap-2">
              <span>Tax Rate (%)</span>
              <input
                type="number"
                title="Tax Rate"
                className="w-16 px-2 py-1 bg-white border border-surface-200 rounded outline-none"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              />
            </div>
            <span className="font-medium">${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="pt-4 border-t border-surface-200 flex justify-between items-center">
            <span className="text-lg font-bold text-surface-900">Total</span>
            <span className="text-2xl font-bold text-brand">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-surface-200">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
          {loading ? "Saving..." : (
            <>
              <Save size={20} /> Save Invoice
            </>
          )}
        </button>
      </div>
    </form>
  );
}
