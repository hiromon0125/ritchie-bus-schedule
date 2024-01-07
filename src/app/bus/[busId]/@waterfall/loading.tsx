function LoadingWaterfall() {
  return (
    <div className=" flex flex-col gap-4 pl-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className=" w-full ">
          <div className=" mb-1 h-4 w-full rounded-full bg-gray-200"></div>
          <div className=" h-8 w-full rounded-full bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingWaterfall;
