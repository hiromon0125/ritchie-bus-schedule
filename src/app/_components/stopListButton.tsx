"use client";

import { type Bus } from "@prisma/client";
import { DateTime } from "luxon";
import { useState } from "react";
import { api } from "t/react";

export function StopListButton(params: { buses: Bus[]; stopId: number }) {
  const { buses, stopId } = params;

  const [selectedBus, setSelectedBus] = useState<Bus | undefined>();
  const { data: routes } = api.routes.getAllByStopAndBus.useQuery({
    stopId: stopId,
    busId: selectedBus?.id ?? -1,
  });
  return (
    <div className="flex">
      <div className="buttons">
        {buses.map((bus, i) => (
          <ul
            className="w-full"
            key={i}
            style={{
              backgroundColor: selectedBus === bus ? "lightgray" : "white",
              border: "1px solid black",
            }}
          >
            <button
              className="flex w-full flex-row items-center gap-4 p-2 text-left"
              onClick={() => setSelectedBus(bus)}
            >
              <div
                className="h-4 w-4 rounded-full border-2 border-black"
                style={{
                  backgroundColor: selectedBus === bus ? "red" : "white",
                }}
              />
              Bus {bus.id}
            </button>
          </ul>
        ))}
      </div>

      <div className="time">
        <ul
          className="mb-8 ml-4 w-[400px] text-xl"
          style={{ backgroundColor: "lightgray", border: "1px solid black" }}
        >
          <li className=" flex flex-row border border-black">
            <p className=" flex-1 border border-black p-2 px-3 font-bold">
              Arrival Time
            </p>
            <p className=" flex-1 border border-black p-2 px-3 font-bold">
              Departure Time
            </p>
          </li>
          {routes?.map((route, i) => {
            const arriDT = route.arriTime
              ? DateTime.fromJSDate(route.arriTime)
              : null;
            const deptDT = DateTime.fromJSDate(route.deptTime);
            return (
              <li className=" flex flex-row " key={i}>
                <p className=" flex-1 border border-black px-3 text-right">
                  {arriDT?.toFormat("hh:mm a")}
                </p>
                <p className=" flex-1 border border-black px-3 text-right">
                  {deptDT.toFormat("hh:mm a")}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
