import { IoChevronForwardSharp } from "react-icons/io5";

export default function BusPageListSkeleton() {
  return (
    <>
      {[...Array(6).keys()].map((count) => (
        <div
          key={count}
          className=" flex w-full flex-row items-center gap-3 border-t-2 p-3 text-white transition-all"
        >
          <div className=" flex flex-1 flex-col gap-2">
            <div className=" flex w-full flex-row items-center gap-2">
              <div className=" aspect-square w-10 animate-pulse rounded-md bg-slate-400" />
              <div className=" h-5 w-full animate-pulse overflow-clip text-ellipsis text-nowrap rounded-md bg-slate-400 text-lg font-bold animation-delay-150" />
            </div>
            <div className=" h-5 w-8/12 animate-pulse rounded-md bg-slate-400"></div>
          </div>
          <IoChevronForwardSharp size={24} />
        </div>
      ))}
    </>
  );
}
