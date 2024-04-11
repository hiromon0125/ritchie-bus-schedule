import SaveStatus from "@/SaveStatus";
import EditBusDetail from "@/editBusDetail";
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

  return (
    <div className=" w-full max-w-screen-lg px-6">
      <div className=" flex flex-row items-center gap-3">
        <h1>Edit Bus Route</h1>
        <SaveStatus />
      </div>
      <EditBusDetail busId={busIdNumber} />
      <EditBusRoute busId={busIdNumber} />
    </div>
  );
}

export default Page;
