import Header from "@/header";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { api } from "t/server";

async function layout({
  children,
  waterfall,
  params,
}: {
  children: React.ReactNode;
  waterfall: React.ReactNode;
  params: { busId: string };
}) {
  const bus = await api.bus.getByID.query({ id: parseInt(params.busId) });
  if (!bus) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  const busColor = (bus.color?.toLowerCase() as `#${string}`) ?? "#000000";
  return (
    <div>
      <Header title="" route="bus" />
      <div
        className=" relative max-w-[100vw]"
        style={{ "--bus-color": busColor } as React.CSSProperties}
      >
        <div className=" m-auto w-full max-w-screen-lg">
          <h2 className=" my-4 max-w-[100vw] text-ellipsis pl-1 text-lg font-extrabold xs:pl-4 sm:my-8 sm:text-4xl md:text-2xl">
            {bus.id} | {bus.name}
          </h2>
        </div>
        <div className=" flex max-w-[100vw] flex-row-reverse flex-wrap justify-end">
          <div className=" z-10 min-w-[360px] flex-1">
            <div className=" z-20 w-24 bg-white">
              <div className=" h-11 w-11 rounded-tr-full border-r-[32px] border-t-[32px] border-[--bus-color] sm:h-24 sm:w-24 sm:border-r-[64px] sm:border-t-[64px]" />
            </div>
            <div className=" sticky top-0 -z-20">
              <div className=" ml-3 mt-[-40px] h-[40px] w-8 bg-[--bus-color] sm:ml-8 sm:mt-[-80px] sm:h-20 sm:w-16" />
              <ol className=" relative ml-3 min-h-[60vh] border-l-[32px] border-[--bus-color] pt-6 sm:ml-8 sm:border-l-[64px] sm:pb-6">
                {waterfall}
              </ol>
              <div className=" z-0 mb-[-64px] bg-white">
                <div className=" ml-3 rounded-bl-full border-b-[32px] border-l-[32px] border-[--bus-color] p-6 sm:ml-8 sm:border-b-[64px] sm:border-l-[64px] sm:p-12" />
              </div>
            </div>
          </div>
          <div className=" z-0 flex flex-1 flex-col items-center border-t-[64px] border-[--bus-color] p-4 md:items-end">
            <div className=" w-full max-w-md">{children}</div>
          </div>
        </div>
        <div className=" h-16" />
      </div>
    </div>
  );
}

export default layout;
