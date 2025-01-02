import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className='flex flex-col justify-center h-screen gap-6 text-center max-w-5xl mx-auto'>
      <h1 className='text-5xl font-bold'>Invoicipedia</h1>
      <p>
        <Button asChild>
          <Link href={"/dashboard"}>Sign in</Link>
        </Button>
      </p>
    </main>
  );
}
