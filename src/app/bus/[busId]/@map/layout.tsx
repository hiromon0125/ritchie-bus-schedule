export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-border-background relative flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:min-h-0 md:max-w-screen-lg">
      <div className=" h-[50vh] w-full flex-1 overflow-clip rounded-xl md:h-full">
        {children}
      </div>
      <div className=" absolute left-0 top-0 flex w-full flex-row justify-between p-4 xs:p-5">
        <div className=" w-full rounded-md bg-white p-2">
          <h2 className=" m-0 text-xl font-bold xs:text-2xl">
            Bus Stop Location
          </h2>
        </div>
      </div>
    </div>
  );
}
