import EditBusList from "@/editors/editBusList";
import EditStopList from "@/editors/editStopList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "t/server";

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
    <div className=" w-full max-w-screen-lg px-6 pb-4">
      <h1>Bus List</h1>
      <EditBusList />
      <h1 className=" mt-10">Station List</h1>
      <EditStopList />
    </div>
  );
}

export default Page;
