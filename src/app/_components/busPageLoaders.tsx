export function TimeTableSkeleton() {
  return (
    <div className=" max-h-[50vh] w-full overflow-scroll bg-white">
      <div className=" flex flex-row items-stretch border-b">
        <div className="relative flex h-auto flex-col pt-2">
          <div className=" h-1 w-5 bg-black" />
          <div className=" mx-[6px] w-2 flex-1 bg-black" />
        </div>
        <div className=" flex flex-row gap-1">
          <p className=" mr-1 w-[74px] pt-2 text-center font-bold">Arrival</p>
          <p className=" py-2 pr-2">-</p>
          <p className=" w-[74px] pt-2 font-bold">Departure</p>
        </div>
      </div>
      {[...Array(5).keys()].map((_, i) => (
        <div key={i} className="flex flex-row items-stretch gap-1 border-b">
          <div className=" relative h-auto">
            <div className=" mx-[6px] h-full w-2 bg-black" />
            <div className=" absolute left-1/2 top-1/2 aspect-square w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-slate-700 bg-white" />
          </div>
          <div className=" m-auto mx-0 mr-3 h-3 w-[62px] animate-pulse rounded-sm bg-gray-400 py-2" />
          <p className=" py-2 pr-2">-</p>
          <div className=" m-auto mx-0 h-3 w-[74px] animate-pulse rounded-sm bg-gray-400 py-2 animation-delay-100" />
        </div>
      ))}
      <div className="relative flex h-4 flex-col pb-2">
        <div className=" mx-[6px] w-2 flex-1 bg-black" />
        <div className=" h-1 w-5 bg-black" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className=" flex h-full w-full animate-pulse items-center justify-center bg-slate-400">
      <p>Loading...</p>
    </div>
  );
}
