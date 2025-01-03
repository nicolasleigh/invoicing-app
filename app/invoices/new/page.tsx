"use client";

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
import { SyntheticEvent, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import Form from "next/form";
import Container from "@/components/Container";

export default function Page() {
  // const [state, setState] = useState("ready");

  // async function handleOnSubmit(event: SyntheticEvent) {
  //   if (state === "pending") {
  //     event.preventDefault();
  //     return;
  //   }
  //   setState("pending");
  // }

  return (
    <main className='h-full'>
      <Container>
        <div className='flex justify-between mb-6'>
          <h1 className='text-3xl font-semibold'>Create Invoice</h1>
        </div>

        {/* <Form action={createAction} onSubmit={handleOnSubmit} className='grid gap-4 max-w-xs'> */}
        <Form action={createAction} className='grid gap-4 max-w-xs'>
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
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </main>
  );
}
