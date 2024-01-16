import { TRPCClientError } from "@trpc/client";
import React from "react";
import { api } from "../../../trpc/server";
import Header from "../../_components/header";

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
      <Header />
      <div className=" relative">
        <div className=" max-w-full overflow-scroll">
          <h2 className=" my-8 whitespace-nowrap pl-4 text-4xl font-extrabold">
            {bus.name}
          </h2>
        </div>
        <div className=" flex flex-row-reverse flex-wrap justify-end">
          <div className=" z-10 min-w-[360px] max-w-2xl flex-1">
            <div className=" z-20 w-24 bg-white">
              <div
                className=" h-4 w-4 rounded-tr-full border-r-[64px] border-t-[64px] p-4"
                style={{ borderColor: busColor }}
              />
            </div>
            <div className=" sticky top-0 -z-20">
              <div
                className=" ml-8 mt-[-80px] h-20 w-16"
                style={{ backgroundColor: busColor }}
              />
              <ol
                className=" relative ml-8 border-l-[64px] py-6"
                style={{ borderColor: busColor }}
              >
                {waterfall}
              </ol>
              <div className=" z-0 mb-[-64px] bg-white">
                <div
                  className=" ml-8 rounded-bl-full border-b-[64px] border-l-[64px]  p-12"
                  style={{ borderColor: busColor }}
                />
              </div>
            </div>
          </div>
          <div
            className=" z-0 min-w-96 flex-1 border-t-[64px] p-4"
            style={{ borderColor: busColor }}
          >
            {children}
          </div>
        </div>
        <div className=" h-16" />
      </div>
    </div>
  );
}

export default layout;
