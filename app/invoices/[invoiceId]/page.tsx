import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Invoice from "./invoice";

export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { userId } = await auth();
  const param = await params;
  const invoiceId = parseInt(param.invoiceId);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }
  if (!userId) return;
  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);
  if (!result) {
    notFound();
  }

  return <Invoice invoice={result} />;
}
