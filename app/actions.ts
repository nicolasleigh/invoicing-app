"use server";

import { db } from "@/db";
import { Customers, Invoices, Status } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { Resend } from "resend";
import InvoiceCreatedEmail from "@/emails/invoice-created";

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();
  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!userId) {
    return;
  }

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      userId,
      customerId: customer.id,
      description,
      status: "open",
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  try {
    const { data, error } = await resend.emails.send({
      from: "Invoice <info@linze.pro>",
      to: [email],
      subject: "You have a new invoice",
      react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
    });
    console.log("data", data);
    console.log("error", error);
  } catch (error) {
    console.log(error);
    return;
  }

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData, revalidate = true) {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId)));
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  if (revalidate) {
    revalidatePath(`/invoices/${id}`, "page");
  }
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  if (orgId) {
    await db.delete(Invoices).where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId)));
  } else {
    await db
      .delete(Invoices)
      .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  redirect("/dashboard");
}

export async function createPayment(formDate: FormData) {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const id = parseInt(formDate.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  // https://docs.stripe.com/checkout/quickstart?client=next
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product: "prod_RWydVHVugFADXb",
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // https://docs.stripe.com/payments/checkout/custom-success-page
    success_url: `${origin}/invoices/${id}/payment/?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment/?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) throw new Error("Invalid session");
  redirect(session.url);
}
