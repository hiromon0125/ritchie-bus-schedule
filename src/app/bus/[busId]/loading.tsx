import { MdFavoriteBorder } from "react-icons/md";
import { BusInfoSkeleton } from "../../_components/busStatus";

export default function Page() {
  return (
    <>
      <div className=" bg-border-background flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
        <div className=" bg-item-background flex w-full flex-row rounded-xl p-2 md:gap-2">
          <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
          <div className=" bg-item-background flex w-full flex-col gap-2 px-2 md:p-3">
            <div className=" flex flex-row items-center gap-2">
              <div className=" aspect-square min-w-10 animate-pulse rounded-md bg-slate-400" />
              <div className=" h-6 w-2/3 animate-pulse rounded-md bg-slate-400"></div>
              <MdFavoriteBorder size={24} color="gray" />
            </div>
            <div className=" h-5 w-2/3 animate-pulse rounded-sm bg-slate-400" />
          </div>
        </div>
        <div className=" bg-item-background flex w-full flex-col gap-2 rounded-xl p-2 pl-3">
          <h2 className=" m-0 text-lg font-semibold md:text-2xl">Status</h2>
        </div>
        <div className=" bg-item-background flex w-full flex-row gap-4 rounded-xl px-2 md:p-2 md:pl-3">
          <div className=" flex w-full flex-col gap-2 py-2">
            <div className=" flex flex-row items-center gap-2">
              <div className=" aspect-square w-8 animate-pulse rounded-full bg-slate-400" />
              <div className=" h-4 w-1/3 min-w-60 animate-pulse rounded-sm bg-slate-400" />
            </div>
            <div className=" flex flex-row items-center gap-3 pl-2">
              <div className=" aspect-square w-3 animate-pulse rounded-full bg-slate-400" />
              <div className=" h-4 w-1/3 min-w-48 animate-pulse rounded-sm bg-slate-400" />
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-border-background flex w-[--sm-max-w] flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
        <div className=" bg-item-background flex w-full flex-row justify-between rounded-xl p-3 py-2">
          <h2 className=" m-0 text-xl font-bold xs:text-2xl">Select Stops</h2>
        </div>
        {[...(Array(6).fill("") as string[])].map((_, i) => (
          <div
            className=" min-w-[calc(100vw-48px)] flex-1 md:w-auto md:min-w-[300px] md:max-w-[calc(50%-5px)] lg:min-w-[calc(50%-12px)]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
    </>
  );
}
