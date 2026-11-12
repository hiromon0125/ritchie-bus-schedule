export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-border-background xs:gap-3 xs:rounded-3xl xs:p-3 relative flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 md:min-h-0 md:max-w-(--breakpoint-lg)">
      <div className="h-[50vh] w-full flex-1 overflow-clip rounded-xl md:h-full">
        {children}
      </div>
      <div className="xs:p-5 absolute top-0 left-0 flex w-full flex-row justify-between p-4">
        <div className="bg-item-background w-full rounded-md p-2">
          <h2 className="xs:text-2xl m-0 text-xl font-bold">
            Bus Stop Location
          </h2>
        </div>
      </div>
    </div>
  );
}
