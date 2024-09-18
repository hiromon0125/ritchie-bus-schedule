import EditBusList from "@/editors/editBusList";
import EditStopList from "@/editors/editStopList";

async function Page() {
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
