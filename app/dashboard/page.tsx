import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";

export default async function Home() {
  const results = await db.select().from(Invoices);
  // console.log(results);

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
          {results.map((result) => {
            return (
              <TableRow key={result.id}>
                <TableCell className='font-medium text-left p-0'>
                  <Link href={`/invoices/${result.id}`} className='font-semibold p-4 block'>
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link href={`/invoices/${result.id}`} className='font-semibold p-4 block'>
                    John Doe
                  </Link>
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link href={`/invoices/${result.id}`} className='p-4 block'>
                    john@email.com
                  </Link>
                </TableCell>
                <TableCell className='text-left p-0'>
                  <Link href={`/invoices/${result.id}`} className='p-4 block'>
                    <Badge
                      className={cn(
                        "rounded-full capitalize",
                        result.status === "open" && "bg-blue-500",
                        result.status === "paid" && "bg-green-600",
                        result.status === "void" && "bg-zinc-700",
                        result.status === "uncollectible" && "bg-red-600"
                      )}
                    >
                      {result.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className='text-right p-0'>
                  <Link href={`/invoices/${result.id}`} className='font-semibold p-4 block'>
                    ${(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
