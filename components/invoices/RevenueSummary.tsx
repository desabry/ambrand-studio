import { Banknote, Clock, FileCheck, Landmark } from "lucide-react";

interface Props {
  total: number;
  paid: number;
  pending: number;
  unpaid: number;
}

export function RevenueSummary({ total, paid, pending, unpaid }: Props) {
  const cards = [
    { label: "Total Revenue", value: total, icon: Landmark, color: "text-brand" },
    { label: "Paid Invoices", value: paid, icon: FileCheck, color: "text-emerald-600" },
    { label: "Pending Amount", value: pending, icon: Clock, color: "text-amber-600" },
    { label: "Unpaid Total", value: unpaid, icon: Banknote, color: "text-rose-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-5 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-surface-50 ${card.color}`}>
            <card.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-surface-900">
              ${card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
