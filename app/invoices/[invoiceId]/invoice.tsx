"use client";

import { deleteInvoiceAction, updateStatusAction } from "@/app/actions";
import Container from "@/components/Container";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_STATUS } from "@/data/invoices";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ChevronDown, Ellipsis, Trash2 } from "lucide-react";
import { useOptimistic } from "react";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(invoice.status, (state, newStatus) => {
    return String(newStatus);
  });

  async function handleOnUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));
    try {
      // await new Promise((r) => setTimeout(r, 1000));
      // throw new Error("test");
      await updateStatusAction(formData);
    } catch (error) {
      setCurrentStatus(originalStatus);
    }
  }

  return (
    <main className='w-full h-full'>
      <Container>
        <div className='flex justify-between mb-8'>
          <h1 className='flex items-center gap-4 text-3xl font-semibold'>
            Invoices {invoice.id}
            <Badge
              className={cn(
                "rounded-full capitalize",
                currentStatus === "open" && "bg-blue-500",
                currentStatus === "paid" && "bg-green-600",
                currentStatus === "void" && "bg-zinc-700",
                currentStatus === "uncollectible" && "bg-red-600"
              )}
            >
              {currentStatus}
            </Badge>
          </h1>
          <div className='flex gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='w-40'>
                <Button variant='outline' className='flex items-center gap-2'>
                  Change Status
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40'>
                {AVAILABLE_STATUS.map((s) => {
                  return (
                    <DropdownMenuItem key={s.id} asChild>
                      <form action={handleOnUpdateStatus} className='px-0 py-0'>
                        <input type='hidden' name='id' value={invoice.id} />
                        <input type='hidden' name='status' value={s.id} />
                        <button className='w-full text-start px-2 py-1.5'>{s.label}</button>
                      </form>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className=''>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <span className='sr-only'>More Options</span>
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=''>
                  <DropdownMenuItem asChild>
                    <AlertDialogTrigger asChild>
                      <button className='w-full px-2 py-1.5 flex gap-2 items-center'>
                        <Trash2 className='w-4' />
                        Delete Invoice
                      </button>
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader className=''>
                  <AlertDialogTitle className='text-2xl'>Delete Invoice?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your invoice and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <form action={deleteInvoiceAction} className='px-0 py-0'>
                    <input type='hidden' name='id' value={invoice.id} />
                    <Button variant='destructive' className='w-full px-2 py-1.5 flex gap-2 items-center'>
                      <Trash2 className='w-4' />
                      Delete Invoice
                    </Button>
                  </form>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p></p>
        </div>

        <p className='text-3xl mb-3'>${(invoice.value / 100).toFixed(2)}</p>

        <p className='text-lg mb-8'>{invoice.description}</p>

        <h2 className='font-bold text-lg mb-4'>Billing Details</h2>

        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice ID</strong>
            <span>{invoice.id}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice Date</strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Billing Name</strong>
            <span>{invoice.customer.name}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Billing Email</strong>
            <span>{invoice.customer.email}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
