import EditBusList from "@/editors/editBusList";
import EditStopList from "@/editors/editStopList";
import { FlushCacheBtn } from "../_components/editors/flushCache";

async function Page() {
  return (
    <div className="w-full max-w-(--breakpoint-lg) px-6 pb-4">
      <h1>Manage Buses</h1>
      <h2 className="text-2xl">Bus List</h2>
      <EditBusList />
      <h2 className="mt-10 text-2xl">Station List</h2>
      <EditStopList />
      <div className="mt-10 flex flex-col gap-2 rounded-md border-2 border-red-400 p-3 dark:bg-red-500/15">
        <h2 className="text-2xl">Reset Cache</h2>
        <p className="font-light">
          Use this in case any old cache gets left behind after editing. Do not
          use this often as it will increase server cost and reduce load time
          for users.
        </p>
        <FlushCacheBtn />
      </div>
    </div>
  );
}

export default Page;
