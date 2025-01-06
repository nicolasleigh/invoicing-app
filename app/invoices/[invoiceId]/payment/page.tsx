import { createPayment, updateStatusAction } from "@/app/actions";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { Check, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import Stripe from "stripe";

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ status: string; session_id: string }>;
}

export default async function Invoice({ params, searchParams }: InvoicePageProps) {
  const param = await params;
  const searchParam = await searchParams;

  const invoiceId = parseInt(param.invoiceId);

  const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY!);

  const sessionId = searchParam.session_id;
  const isSuccess = sessionId && searchParam.status === "success";
  const isCanceled = searchParam.status === "canceled";
  let isError = isSuccess && !sessionId;
  // console.log("isSuccess", isSuccess);
  // console.log("isCanceled", isCanceled);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(sessionId);
    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");
      await updateStatusAction(formData, false);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }
  if (!result) notFound();

  const invoices = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className='w-full h-full'>
      <Container>
        {isError && (
          <p className='text-sm bg-red-100 text-red-800 text-center px-3 py-2 rounded-lg mb-6'>
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className='text-sm bg-yellow-100 text-yellow-800 text-center px-3 py-2 rounded-lg mb-6'>
            Payment was canceled, please try again.
          </p>
        )}
        <div className='grid grid-cols-2'>
          <div>
            <div className='flex justify-between mb-8'>
              <h1 className='flex items-center gap-4 text-3xl font-semibold'>
                Invoices {invoices.id}
                <Badge
                  className={cn(
                    "rounded-full capitalize",
                    invoices.status === "open" && "bg-blue-500",
                    invoices.status === "paid" && "bg-green-600",
                    invoices.status === "void" && "bg-zinc-700",
                    invoices.status === "uncollectible" && "bg-red-600"
                  )}
                >
                  {invoices.status}
                </Badge>
              </h1>
            </div>
            <p className='text-3xl mb-3'>${(invoices.value / 100).toFixed(2)}</p>
            <p className='text-lg mb-8'>{invoices.description}</p>
          </div>
          <div>
            <h2 className='text-xl font-bold mb-4'>Manage Invoice</h2>
            {invoices.status === "open" && (
              <form action={createPayment}>
                <input type='hidden' name='id' value={invoices.id} />
                <Button className='bg-green-700 font-bold'>
                  <CreditCard className='w-5' />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoices.status === "paid" && (
              <p className='flex gap-2 items-center text-xl font-bold'>
                <Check className='w-8 h-auto bg-green-500 rounded-full text-white p-1' />
                Invoice Paid
              </p>
            )}
          </div>
        </div>

        <h2 className='font-bold text-lg mb-4'>Billing Details</h2>
        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice ID</strong>
            <span>{invoices.id}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice Date</strong>
            <span>{new Date(invoices.createTs).toLocaleDateString()}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Billing Name</strong>
            <span>{invoices.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}