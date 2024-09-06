"use client";
import { DateTime } from "luxon";
import { useState } from "react";
import { api } from "t/react";
import type { Bus, BusStop } from "./types";

interface StopParams {
  stops: BusStop[];
  bus: Bus;
}

function StopInfo(params: StopParams) {
  const { stops, bus } = params;
  const [selectedStop, setSelectedStop] = useState<BusStop>();
  const { data: selectedRoutes, isLoading } =
    api.routes.getAllByStopAndBus.useQuery({
      stopId: selectedStop?.id ?? -1,
      busId: bus?.id ?? -1,
    });
  return (
    <>
      <h2 className=" text-2xl font-bold sm:mb-2 sm:text-4xl">Stops Info</h2>
      <p className=" mb-2 text-lg">
        Select the stop to see the time of arrival and departure
      </p>
      <ul className=" mb-8 w-full text-xl">
        {stops.map((stop, i) => (
          <li className=" w-full" key={i}>
            <button
              className=" flex w-full flex-row items-center gap-4 p-2 text-left"
              onClick={() => setSelectedStop(stop)}
            >
              <div
                className=" h-4 w-4 rounded-full border-2 border-black"
                style={{
                  backgroundColor:
                    selectedStop?.id === stop.id
                      ? (bus?.color ?? "white")
                      : "white",
                }}
              />
              {stop.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedStop && (
        <div>
          <div className=" grid grid-cols-2 border-2 text-center">
            <p className=" border-2 py-2 text-lg">Arrival Time</p>
            <p className=" border-2 py-2 text-lg">Departure Time</p>
            {selectedRoutes
              ?.map((route) => [route.arriTime, route.deptTime])
              .flat()
              .map((date, i) => {
                const formattedDate = date
                  ? DateTime.fromJSDate(date)
                  : undefined;
                return (
                  <p
                    className=" min-h-4 min-w-16 border-2 py-2 text-lg"
                    key={i}
                  >
                    {formattedDate?.toFormat("hh:mm a") ?? ""}
                  </p>
                );
              }) ??
              (isLoading
                ? "Loading..."
                : "An error occurred. Refresh the page.")}
          </div>
        </div>
      )}
    </>
  );
}

export default StopInfo;
