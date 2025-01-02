import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

export default function Home() {
  return (
    <main className='flex flex-col justify-center h-full gap-6 text-center max-w-5xl mx-auto my-12'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-semibold'>Invoices</h1>
        <p>
          <Button variant='ghost' className='inline-flex' asChild>
            <Link href='/invoices/new'>
              <CirclePlus className='h-4 w-4' />
              Create Invoice
            </Link>
          </Button>
        </p>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px] p-4'>Date</TableHead>
            <TableHead className='p-4'>Customer</TableHead>
            <TableHead className='p-4'>Email</TableHead>
            <TableHead className='p-4'>Status</TableHead>
            <TableHead className='text-right p-4'>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='font-medium text-left p-4'>
              <span className='font-semibold'>10/31/2024</span>
            </TableCell>
            <TableCell className='text-left p-4'>
              <span className='font-semibold'>John Doe</span>
            </TableCell>
            <TableCell className='text-left p-4'>
              <span className=''>john@email.com</span>
            </TableCell>
            <TableCell className='text-left p-4'>
              <Badge className='rounded-full'>Open</Badge>
            </TableCell>
            <TableCell className='text-right p-4'>
              <span className='font-semibold'>$250.00</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
