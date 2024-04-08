import { Suspense } from "react";
import BusList, { BusListSkeleton } from "./_components/busStatus";
import Header from "./_components/header";

export default async function Home() {
  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 pb-8 text-black">
      <Header />
      <Suspense fallback={<BusListSkeleton />}>
        <BusList />
      </Suspense>
    </main>
  );
}
