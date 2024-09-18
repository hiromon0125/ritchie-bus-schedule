import SaveStatus from "@/SaveStatus";
import EditBusDetail from "@/editors/editBusDetail";
import EditBusRoute from "@/editors/editBusRoute";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
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
  const bus = await api.bus.getByID.query({ id: busIdNumber });

  if (!bus) {
    return (
      <div>
        <h1>Bus not found</h1>
        <p>Bus ID: {params.busId}</p>
        <Link href="/manage">
          <a>Back to bus list</a>
        </Link>
      </div>
    );
  }

  return (
    <div className=" w-full max-w-screen-lg px-6">
      <div className=" flex flex-row items-center gap-3">
        <h1>Edit Bus Detail</h1>
        <SaveStatus />
      </div>
      <EditBusDetail busId={busIdNumber} />
      <div className=" mt-12">
        <h1>Edit Bus Route</h1>
      </div>
      <EditBusRoute bus={bus} />
    </div>
  );
}

export default Page;
