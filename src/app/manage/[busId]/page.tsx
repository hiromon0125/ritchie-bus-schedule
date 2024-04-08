import EditBusRoute from "@/editBusRoute";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "t/server";
import { z } from "zod";

async function Page({ params }: { params: { busId: string } }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const manager = await api.manager.isManager.query({ userId: userId });
  if (!manager) {
    redirect("/");
  }

  const busIdNumber = z.coerce.number().parse(params.busId);

  return <EditBusRoute busId={busIdNumber} />;
}

export default Page;
