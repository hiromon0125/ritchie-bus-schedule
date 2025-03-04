"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { Bus } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { api } from "t/react";
import { AnimatedDoubleList, ClickEventBlocker } from "./animatedList";
import { BusStatus } from "./busStatusClient";
import { FavBtn } from "./favBtn";
import { BusTag } from "./tags";

export function BusInfo({
  bus: busObj,
  isFavorited,
}: {
  bus: Bus;
  isFavorited?: boolean;
}) {
  const color = (busObj.color?.toLowerCase() as `#${string}`) ?? "#000000";
  const { isSignedIn } = useUser();
  const util = api.useUtils();
  const { mutate: favoriteMutation } = api.favorite.addBus.useMutation({
    onSuccess: async () => {
      await util.favorite.getAllBus.invalidate();
    },
  });
  const { mutate: unfavoriteMutation } = api.favorite.delBus.useMutation({
    onSuccess: async () => {
      await util.favorite.getAllBus.invalidate();
    },
  });

  return (
    <div className=" relative h-full w-full">
      <ClickEventBlocker className=" h-full w-full">
        <Link
          href={`/bus/${busObj.id}`}
          title={`${busObj.id} ${busObj.name}`}
          className=" relative h-full"
        >
          <div
            className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-white bg-white p-1 transition-all hover:border-[#1567ea] hover:shadow-md"
            style={{ "--bus-color": color } as React.CSSProperties}
          >
            <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
            <div className=" relative flex w-min flex-1 flex-col flex-wrap justify-between">
              <div className=" mr-1 flex flex-1 flex-row items-center gap-2 pl-2 pr-2 pt-2">
                <BusTag bus={busObj} size="sm" />
                <h2 className=" w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left font-bold md:text-xl">
                  {busObj?.name}
                </h2>
                <div className=" favbtn-placeholder h-6 w-6" />
              </div>
              <BusStatus busId={busObj.id} />
            </div>
          </div>
        </Link>
      </ClickEventBlocker>
      <FavBtn
        className=" absolute right-3 top-3 z-10"
        isFavorited={isFavorited ?? false}
        onClick={() => {
          if (!isSignedIn) {
            alert("Please sign in to favorite this bus");
            return;
          }
          if (!isFavorited) {
            favoriteMutation({ busId: busObj.id });
          } else {
            unfavoriteMutation({ busId: busObj.id });
          }
        }}
      />
    </div>
  );
}

export function SkeletonBusStatusString() {
  return (
    <div className=" flex h-12 flex-row items-center">
      <div className=" relative ml-5 h-3 w-3">
        <div className=" absolute left-0 top-0 h-3 w-3 rounded-full bg-[--bus-color] animation-delay-100" />
      </div>
      <div className=" relative flex h-full w-full flex-col justify-center pl-4">
        <div className=" h-5 w-9/12 animate-pulse rounded-sm bg-slate-300 animation-delay-100" />
      </div>
    </div>
  );
}

export function BusInfoSkeleton() {
  return (
    <div className=" relative -z-0">
      <div
        className="relative box-border flex h-full w-full flex-row items-stretch rounded-xl border-[3px] border-white bg-white p-1"
        style={{ "--bus-color": "gray" } as React.CSSProperties}
      >
        <div className=" h-auto min-w-3 rounded-l-md bg-[--bus-color]" />
        <div className=" relative flex w-full flex-1 flex-col flex-wrap justify-between">
          <div className=" mr-1 flex w-full flex-1 flex-row items-center px-4 pt-2">
            <div className=" h-4 w-full animate-pulse overflow-hidden text-ellipsis text-nowrap rounded-sm bg-slate-300 font-bold md:text-xl"></div>
          </div>
          <SkeletonBusStatusString />
        </div>
      </div>
    </div>
  );
}

export function InfoSkeleton() {
  return (
    <div className=" relative flex w-full flex-1 flex-col flex-wrap justify-between">
      <div className=" mr-1 flex w-full flex-1 flex-row items-center px-4 pt-2">
        <div className=" h-4 w-full animate-pulse overflow-hidden text-ellipsis text-nowrap rounded-sm bg-slate-300 font-bold md:text-xl"></div>
      </div>
      <SkeletonBusStatusString />
    </div>
  );
}

export function BusList() {
  const { isSignedIn } = useUser();
  const { data: favBuses } = api.favorite.getAllBus.useQuery();
  const { data: buses, isLoading: isLoadingBuses } = api.bus.getAll.useQuery();
  const favBusesId = favBuses?.map((bus) => bus.busId) ?? [];
  return (
    <AnimatedDoubleList
      favoritedBusKeys={favBusesId.map((favBus) => favBus.toString())}
      emptySection={
        isSignedIn ? (
          <div className=" flex h-28 w-full flex-row items-center justify-center rounded-md p-2 text-lg font-bold text-slate-500">
            Favorite some buses from below to see them here!
          </div>
        ) : (
          <div className=" flex h-28 w-full flex-row items-center justify-center gap-1 rounded-md bg-slate-300 p-2 text-lg font-bold text-slate-600">
            <SignInButton>
              <u className=" text-blue-600 underline">Sign in</u>
            </SignInButton>
            <p>to add your favorite buses.</p>
          </div>
        )
      }
      locked={!isSignedIn}
    >
      {isLoadingBuses
        ? Array(6).map((_, i) => {
            return (
              <div
                className=" w-auto min-w-full flex-1 md:min-w-[40%] md:max-w-[calc(50%-6px)]"
                key={i}
              >
                <BusInfoSkeleton />
              </div>
            );
          })
        : (buses ?? []).map((bus) => (
            <div className=" h-full w-full" key={bus.id}>
              <BusInfo bus={bus} isFavorited={favBusesId.includes(bus.id)} />
            </div>
          ))}
    </AnimatedDoubleList>
  );
}

export function BusListSkeleton() {
  return (
    <div className=" flex w-[--sm-max-w] flex-col gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Favorite Buses</h1>
      </div>
      <div className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80">
        {Array(4).map((_, i) => (
          <div
            className=" w-auto min-w-full flex-1 md:min-w-[40%] md:max-w-[calc(50%-6px)]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
      <div className=" flex flex-row justify-between rounded-xl bg-white p-3 py-2">
        <h1 className=" m-0 text-2xl font-bold">Buses</h1>
      </div>
      <div className=" relative flex max-w-screen-lg flex-row flex-wrap gap-3 md:min-w-80">
        {Array(6).map((_, i) => (
          <div
            className=" w-auto min-w-full flex-1 md:min-w-[40%] md:max-w-[calc(50%-6px)]"
            key={i}
          >
            <BusInfoSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
