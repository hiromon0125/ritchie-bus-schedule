import { MdDirectionsBus } from "react-icons/md";
import { TimeTableSkeleton } from "../../../_components/busPageLoaders";

export default function Page() {
  return (
    <div className=" bg-border-background flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
      <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
        <div className=" flex flex-col gap-2">
          <h2 className=" m-0 pl-2 font-bold text-gray-700 xs:text-lg">
            Timetable
          </h2>
          <div className=" flex flex-row items-center gap-2">
            <div className=" aspect-square min-w-12 animate-pulse rounded-full bg-slate-400" />
            <div className=" h-6 w-2/3 animate-pulse rounded-md bg-slate-400" />
          </div>
        </div>
        <div className=" mr-2 flex flex-col items-center justify-center">
          <MdDirectionsBus size={24} color="gray" />
          <p className=" text-sm text-[gray]">View</p>
        </div>
      </div>
      <div className=" flex w-full flex-col justify-between rounded-xl bg-white p-3 py-2">
        <TimeTableSkeleton />
      </div>
    </div>
  );
}
