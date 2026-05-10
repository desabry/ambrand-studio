export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'overdue' | 'cancelled';

export interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  country?: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  quotation_id?: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_status: PaymentStatus;
  due_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  clients?: Client; // Join data
  invoice_items?: InvoiceItem[];
}
