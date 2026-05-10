"use client";

import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";
import { format } from "date-fns";

// Register fonts if needed, but standard ones are okay for now
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1f2937" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  logo: { width: 120, height: "auto" },
  brandColor: { color: "#e31937" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  metadata: { color: "#6b7280", fontSize: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", borderBottom: 1, borderBottomColor: "#e5e7eb", paddingBottom: 5, marginBottom: 10, color: "#374151" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  label: { color: "#6b7280" },
  value: { fontWeight: "bold" },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f9fafb", borderBottom: 1, borderBottomColor: "#e5e7eb", padding: 8, fontWeight: "bold" },
  tableRow: { flexDirection: "row", borderBottom: 1, borderBottomColor: "#f3f4f6", padding: 8 },
  colDescription: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },
  summary: { marginTop: 30, width: "200pt", alignSelf: "flex-end" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalRow: { borderTop: 1, borderTopColor: "#e5e7eb", marginTop: 5, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontSize: 14, fontWeight: "bold" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#e31937" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, borderTop: 1, borderTopColor: "#f3f4f6", paddingTop: 20, textAlign: "center", color: "#9ca3af", fontSize: 8 },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, styles.brandColor]}>INVOICE</Text>
          <Text style={styles.metadata}>#{invoice.invoice_number}</Text>
          <Text style={styles.metadata}>Date: {format(new Date(invoice.created_at), "MMMM d, yyyy")}</Text>
          <Text style={styles.metadata}>Due: {format(new Date(invoice.due_date), "MMMM d, yyyy")}</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={{ fontWeight: "bold", fontSize: 12 }}>Ambrand Studio</Text>
          <Text style={styles.metadata}>Professional Branding & Design</Text>
          <Text style={styles.metadata}>hello@ambrand.studio</Text>
          <Text style={styles.metadata}>www.ambrand.studio</Text>
        </View>
      </View>

      {/* Addresses */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 40 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>{invoice.clients?.company_name}</Text>
          <Text style={styles.metadata}>{invoice.clients?.contact_person}</Text>
          <Text style={styles.metadata}>{invoice.clients?.email}</Text>
          <Text style={styles.metadata}>{invoice.clients?.country}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colDescription}>Service Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit Price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {invoice.invoice_items?.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.colDescription}>
              <Text style={{ fontWeight: "bold" }}>{item.item_name}</Text>
              <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>{item.description}</Text>
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>${item.unit_price.toFixed(2)}</Text>
            <Text style={styles.colTotal}>${item.total_price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${invoice.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Tax (10%)</Text>
          <Text style={styles.value}>${invoice.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>${invoice.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Notes */}
      {invoice.notes && (
        <View style={{ marginTop: 40 }}>
          <Text style={styles.sectionTitle}>NOTES</Text>
          <Text style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.5 }}>{invoice.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text style={{ marginTop: 4 }}>Ambrand Studio - Creative Excellence Since 2020</Text>
      </View>
    </Page>
  </Document>
);
