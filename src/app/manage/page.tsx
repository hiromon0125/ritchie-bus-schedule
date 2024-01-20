import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "../../trpc/server";
import DateToDateTime from "../_components/date-to-datetime";
import Header from "../_components/header";

async function Page() {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const manager = await api.manager.isManager.query({ userId: userId });
  if (!manager) {
    redirect("/");
  }

  return (
    <main className=" flex min-h-screen w-full flex-col items-center bg-slate-100 text-black">
      <Header />
      <DateToDateTime />
    </main>
  );
}

export default Page;
