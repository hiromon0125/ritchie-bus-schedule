import { IoChevronForwardSharp } from "react-icons/io5";

export default function StopListSkeleton() {
  return [...Array(6).keys()].map((count) => (
    <div
      key={count}
      className="bg-item-background hover:border-accent border-item-background flex w-full flex-row items-center justify-between rounded-xl border-[3px] p-3 pl-4 transition-all"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <div className="aspect-square w-9 animate-pulse rounded-full bg-slate-400" />
          <div className="animation-delay-150 h-5 w-full animate-pulse overflow-clip rounded-md bg-slate-400 text-lg font-bold text-nowrap text-ellipsis" />
        </div>
        <div className="flex max-w-full flex-row flex-wrap gap-1">
          <div className="aspect-square w-7 animate-pulse rounded-md bg-slate-400" />
          <div className="animation-delay-150 aspect-square w-7 animate-pulse rounded-md bg-slate-400" />
          <div className="animation-delay-300 aspect-square w-7 animate-pulse rounded-md bg-slate-400" />
          {count % 2 === 0 && (
            <div className="animation-delay-450 aspect-square w-7 animate-pulse rounded-md bg-slate-400" />
          )}
        </div>
        <div className="h-5 w-8/12 animate-pulse rounded-md bg-slate-400"></div>
      </div>
      <IoChevronForwardSharp size={24} />
    </div>
  ));
}
