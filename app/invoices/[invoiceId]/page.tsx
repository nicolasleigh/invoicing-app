import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Invoice from "./invoice";

export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { userId, orgId } = await auth();
  const param = await params;
  const invoiceId = parseInt(param.invoiceId);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }
  if (!userId) return;

  let result;
  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId)))
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId), isNull(Invoices.organizationId)))
      .limit(1);
  }

  if (!result) {
    notFound();
  }
  if (!result) notFound();

  const invoices = {
    ...result.invoice,
    customer: result.customers,
  };

  return <Invoice invoice={invoices} />;
}
