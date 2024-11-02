import {
  MapSkeleton,
  TimeTableSkeleton,
} from "../../_components/busPageLoaders";
import { BusInfoSkeleton } from "../../_components/busStatus";

export default function Loading() {
  return (
    <div className=" m-auto flex w-full max-w-screen-lg flex-col gap-2 px-[--margin] py-2 pt-2 xs:gap-4">
      <div className=" flex flex-row items-center gap-2">
        <div className=" flex aspect-square min-w-10 animate-pulse items-center justify-center rounded-md border-[3px] border-gray-300">
          <div className=" h-4 w-4 rounded-sm bg-slate-300" />
        </div>
        <div className=" h-6 w-2/6 animate-pulse rounded-sm bg-slate-300" />
      </div>
      <div className=" flex flex-col gap-2 py-1">
        <div className=" h-4 w-9/12 animate-pulse rounded-sm bg-slate-300" />
        <div className=" h-4 w-1/4 animate-pulse rounded-sm bg-slate-300 animation-delay-100" />
      </div>
      <div className=" flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
        <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
          <h1 className=" m-0 text-xl font-bold xs:text-2xl">Select Stops</h1>
        </div>
        {[...Array(5).keys()].map((_, i) => (
          <div
            className=" min-w-[calc(100vw-48px)] flex-1 md:w-auto md:min-w-[300px] md:max-w-[calc(50%-5px)] lg:min-w-[calc(50%-12px)]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
      <div className=" flex flex-col gap-2 xs:gap-4 md:flex-row">
        <div className=" flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
          <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
            <div className=" flex flex-col gap-2">
              <h2 className=" m-0 pl-2 font-bold text-gray-700 xs:text-lg">
                Timetable
              </h2>
              <div className=" flex flex-row items-center gap-2">
                <div className=" flex items-center justify-center rounded-full border-2 border-gray-300">
                  <div className=" h-3 w-1 animate-pulse rounded-sm bg-slate-300" />
                </div>
                <div className=" h-3 w-2/3 font-semibold xs:text-2xl" />
              </div>
            </div>
          </div>
          <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
            <TimeTableSkeleton />
          </div>
        </div>
        <div className=" relative flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:min-h-0 md:max-w-screen-lg">
          <div className=" h-[50vh] w-full flex-1 overflow-clip rounded-xl md:h-full">
            <MapSkeleton />
          </div>
          <div className=" absolute left-0 top-0 flex w-full flex-row justify-between p-4 xs:p-5">
            <div className=" w-full rounded-md bg-white p-2">
              <h2 className=" m-0 text-xl font-bold xs:text-2xl">
                Bus Stop Location
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
