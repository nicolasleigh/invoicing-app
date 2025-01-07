"use client";

import { createAction } from "@/app/actions";
import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";

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
