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
      <div className=" relative">
        <div className=" m-auto w-full max-w-screen-lg">
          <h2 className=" my-4 whitespace-nowrap pl-4 text-2xl font-extrabold sm:my-8 sm:text-4xl">
            {bus.id} | {bus.name}
          </h2>
        </div>
        <div className=" flex flex-row-reverse flex-wrap justify-end">
          <div className=" z-10 min-w-[360px] flex-1">
            <div className=" z-20 w-24 bg-white">
              <div
                className=" h-11 w-11 rounded-tr-full border-r-[32px] border-t-[32px] sm:h-24 sm:w-24 sm:border-r-[64px] sm:border-t-[64px]"
                style={{ borderColor: busColor }}
              />
            </div>
            <div className=" sticky top-0 -z-20">
              <div
                className=" ml-3 mt-[-40px] h-[40px] w-8 border-black sm:ml-8 sm:mt-[-80px] sm:h-20 sm:w-16"
                style={{ backgroundColor: busColor }}
              />
              <ol
                className=" relative ml-3 border-l-[32px] pt-6 sm:ml-8 sm:border-l-[64px] sm:pb-6"
                style={{ borderColor: busColor }}
              >
                {waterfall}
              </ol>
              <div className=" z-0 mb-[-64px] bg-white">
                <div
                  className=" ml-3 rounded-bl-full border-b-[32px] border-l-[32px] p-6 sm:ml-8 sm:border-b-[64px]  sm:border-l-[64px] sm:p-12"
                  style={{ borderColor: busColor }}
                />
              </div>
            </div>
          </div>
          <div
            className=" z-0 flex min-w-96 flex-1 flex-col items-center border-t-[64px] p-4 md:items-end"
            style={{ borderColor: busColor }}
          >
            <div className=" max-w-md">{children}</div>
          </div>
        </div>
        <div className=" h-16" />
      </div>
    </div>
  );
}

export default layout;
