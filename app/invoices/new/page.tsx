import { sql } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { createAction } from "@/app/actions";

export default async function Page() {
  return (
    <main className='flex flex-col justify-center h-full gap-6  max-w-5xl mx-auto my-12'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-semibold'>Create Invoice</h1>
      </div>

      <form action={createAction} className='grid gap-4 max-w-xs'>
        <div>
          <Label className='block mb-2 font-semibold text-sm' htmlFor='name'>
            Billing Name
          </Label>
          <Input id='name' name='name' type='text' />
        </div>
        <div>
          <Label className='block mb-2 font-semibold text-sm' htmlFor='email'>
            Billing Email
          </Label>
          <Input id='email' name='email' type='email' />
        </div>
        <div>
          <Label className='block mb-2 font-semibold text-sm' htmlFor='value'>
            Value
          </Label>
          <Input id='value' name='value' type='text' />
        </div>
        <div>
          <Label className='block mb-2 font-semibold text-sm' htmlFor='description'>
            Description
          </Label>
          <Textarea id='description' name='description' />
        </div>
        <div>
          <Button className='w-full font-semibold'>Submit</Button>
        </div>
      </form>
    </main>
  );
}
