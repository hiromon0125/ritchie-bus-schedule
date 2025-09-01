"use client";
import type { Bus, Routes, Stops } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdRefreshCircle, IoMdSave, IoMdTrash } from "react-icons/io";
import {
  MdAddBox,
  MdAddToPhotos,
  MdInfoOutline,
  MdOutlineClear,
} from "react-icons/md";

import type { MultiValue } from "react-select";
import { Tooltip } from "react-tooltip";
import type { RouterOutputs } from "t/react";
import { api } from "t/react";
import { z } from "zod";
import selectStyles from "~/styles/selectStyle";
import Select from "./customSelect";
import EditRoutesByFile from "./editByFile";

type RouteObj = Routes;
type RouteInput = Partial<RouteObj> & Pick<RouteObj, "index" | "busId">;
type RoutesArr = RouteInput[];

/**
 * default route when there is no route in the list
 * Uses the local time's hour and minute but with the date set to Jan 1, 1970 UTC
 * Returns the utc date object
 * @param busId
 * @param stopId
 * @returns
 */
function defaultRouteDeptTime() {
  const currLocal = DateTime.now();
  const newDate = DateTime.utc(
    1970,
    1,
    1,
    currLocal.hour,
    currLocal.minute,
    0,
    0,
  );
  return newDate.toJSDate();
}

function getDeptTimeByLastStopRoute(
  input: RoutesArr,
  stopId?: number,
  lastDept?: Date,
): Date | undefined {
  if (!stopId || !lastDept) return undefined;
  const lastStopInstance = _.findLastIndex(
    input,
    (route) => route.stopId === stopId,
  );

  if (lastStopInstance <= 0) return undefined;
  const lastInstanceStop = input[lastStopInstance];
  const lastLastInstanceStop = input[lastStopInstance - 1];
  if (
    lastInstanceStop?.deptTime == undefined ||
    lastLastInstanceStop?.deptTime == undefined
  )
    return undefined;

  const timeDiff =
    lastInstanceStop.deptTime.getTime() -
    lastLastInstanceStop.deptTime.getTime();
  const dt = DateTime.fromJSDate(lastDept, { zone: "utc" }).plus({
    milliseconds: timeDiff,
  });
  return dt.toJSDate();
}

function getArriTimeByLastStopRoute(
  input: RoutesArr,
  stopsCount: number,
  stopId?: number,
  lastArri?: Date | null,
): Date | undefined {
  if (!stopId || !lastArri) return undefined;
  const lastStopInstance = _.findLastIndex(
    input,
    (route) => route.stopId === stopId,
  );

  if (lastStopInstance <= 0) return undefined;
  const lastInstanceStop = input[lastStopInstance];
  const instanceBeforeLastStop =
    stopsCount < lastStopInstance
      ? input[lastStopInstance - stopsCount]
      : undefined;
  if (
    lastInstanceStop?.arriTime == undefined ||
    instanceBeforeLastStop?.arriTime == undefined
  )
    return undefined;

  const diff =
    lastInstanceStop.arriTime.getTime() -
    instanceBeforeLastStop.arriTime.getTime();
  const dt = DateTime.fromJSDate(lastInstanceStop.arriTime, {
    zone: "utc",
  }).plus({
    milliseconds: diff,
  });
  return dt.toJSDate();
}

function createNewRoute(
  stops: number[],
  input: RoutesArr,
  busId: number,
): RouteInput {
  const lastRoute = input[input.length - 1];
  const newStopIdIndex = lastRoute?.stopId
    ? (stops.indexOf(lastRoute.stopId) + 1) % stops.length
    : 0;
  const stopId = stops.at(newStopIdIndex);
  return {
    busId,
    stopId,
    index: lastRoute ? lastRoute.index + 1 : 0,
    deptTime:
      getDeptTimeByLastStopRoute(input, stopId, lastRoute?.deptTime) ??
      defaultRouteDeptTime(),
    arriTime: getArriTimeByLastStopRoute(
      input,
      stops.length,
      stopId,
      lastRoute?.arriTime,
    ),
  };
}

function savedRouteToInput(
  data: RouterOutputs["routes"]["getAllByBusId"] | undefined,
): RoutesArr {
  if (!data) {
    return [];
  }
  return _.sortBy(
    data.map((route) => ({
      ...route,
      arriTime: route.arriTime ?? undefined,
    })),
    "index",
  ) as RoutesArr;
}

function savedRouteToDateInput(data: {
  arriTime?: Date | null;
  deptTime?: Date | null;
}): { arr: string; dep: string } {
  return {
    arr: data.arriTime
      ? DateTime.fromJSDate(data.arriTime, { zone: "utc" }).toFormat("HH:mm")
      : "",
    dep: data.deptTime
      ? DateTime.fromJSDate(data.deptTime, { zone: "utc" }).toFormat("HH:mm")
      : "",
  };
}
function savedRoutesToDateInputs(
  data: RouterOutputs["routes"]["getAllByBusId"] | undefined,
): { arr: string; dep: string }[] {
  if (!data) return [];
  return _.sortBy(data.map(savedRouteToDateInput), "index");
}

function wasAllStopFound(
  stops: { stop: string | Stops; isArrival: boolean }[],
): stops is { stop: Stops; isArrival: boolean }[] {
  return stops.every((stop) => typeof stop.stop !== "string");
}

function EditBusRoute({ busId }: { busId: Bus["id"] }) {
  const utils = api.useUtils();
  const { data: savedBusStopId, isLoading } =
    api.stops.getStopIdsByBusID.useQuery({
      busId,
    });
  const { data } = api.routes.getAllByBusId.useQuery(
    { busId },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const { data: stops } = api.stops.getAll.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { mutate, isPending } = api.routes.updateRoutes.useMutation({
    onSuccess: async () => {
      await utils.bus.getAll.invalidate();
      await utils.routes.getAllByBusId.invalidate({ busId });
    },
  });
  const [editedSelectedStops, setEditedStops] = useState(false);
  const [selectedStops, setStops] = useState(savedBusStopId);
  const [input, setInput] = useState<RoutesArr>(savedRouteToInput(data));
  const [dateInput, setDateInput] = useState(savedRoutesToDateInputs(data));
  const router = useRouter();
  useEffect(() => {
    if (!editedSelectedStops) setStops(savedBusStopId);
  }, [isLoading, editedSelectedStops, savedBusStopId]);
  useEffect(() => {
    setInput(savedRouteToInput(data));
    setDateInput(savedRoutesToDateInputs(data));
  }, [data]);

  const handleSubmit = async () => {
    try {
      const definedInput = z
        .array(
          z.object({
            busId: z.number(),
            stopId: z.number(),
            index: z.number(),
            deptTime: z.date(),
            arriTime: z.date().optional(),
          }),
        )
        .parse(input);

      mutate({
        routes: definedInput,
        busId,
        stopIds: selectedStops ?? [],
      });
    } catch (e) {
      // catch if the input is invalid or attribute is missing
      console.error(e);
    }
  };

  const addNewRoute = () => {
    const i = createNewRoute(selectedStops ?? [], input, busId);
    setInput((prev) => [...prev, i]);
    setDateInput((prev) => [...prev, savedRouteToDateInput(i)]);
  };

  const addMultipleRoutes = () => {
    const inputArr: { arr: string; dep: string }[] = [];
    const currInput = [...input];
    selectedStops?.forEach((_) => {
      const i = createNewRoute(selectedStops ?? [], currInput, busId);
      currInput.push(i);
      inputArr.push(savedRouteToDateInput(i));
    });
    setInput(currInput);
    setDateInput((previ) => [...previ, ...inputArr]);
  };

  const rmLastRoute = () => {
    setInput((prev) => prev.slice(0, -1));
    setDateInput((prev) => prev.slice(0, -1));
  };
  const rmAllRoute = () => {
    setInput([]);
    setDateInput([]);
  };

  const handleFileParse = (data: Record<string, string>[]) => {
    const firstRow = data[0]!;
    const stopNames = Object.keys(firstRow);
    const usedStops = stopNames.map((name) => {
      let stopName = name.toLowerCase();
      let isArrival = false;
      if (stopName.trim().endsWith(" arrival")) {
        stopName = stopName.slice(0, -8).trim();
        isArrival = true;
      } else if (stopName.trim().endsWith(" departure")) {
        stopName = stopName.slice(0, -10).trim();
      }
      return {
        stop:
          stops?.find((stop) => stop.name.trim().toLowerCase() === stopName) ??
          name,
        isArrival,
      };
    });
    if (!wasAllStopFound(usedStops)) {
      console.error(
        `Invalid stop name: ${usedStops.filter((s) => typeof s.stop === "string").reduce((acc, s) => `${acc}, ${(s.stop as string).trim().toLowerCase()}`, "")}`,
      );
      return;
    }
    const stopMap = _.zipObject(stopNames, usedStops);
    const routeTemplate = {
      busId,
      arriTime: undefined,
    };
    const times = data.map((row, ri) => {
      const rowIndex = ri * stopNames.length;
      const res: Record<Stops["id"], RouteInput> = {};
      // Merging departure and arrival times into a single object also indexed to keep order
      Object.entries(row).forEach(([k, v], index) => {
        if (v === "") return undefined;
        const stopId = stopMap[k]!.stop.id;
        const timeDT = DateTime.fromFormat(v, "h:mm a", {
          zone: "utc",
        });
        const time = timeDT
          .set({
            year: 1970,
            month: 1,
            day: 1,
            second: 0,
            millisecond: 0,
          })
          .toJSDate();
        if (stopMap[k]?.isArrival) {
          if (res[stopId] == undefined) {
            res[stopId] = {
              ...routeTemplate,
              stopId,
              arriTime: time,
              index: rowIndex + index,
            };
            return;
          }
          res[stopId].arriTime = time;
          res[stopId].index = rowIndex + index; // index is always the smaller of the two when arrival and departure are present
          return;
        }
        if (res[stopId] == undefined) {
          res[stopId] = {
            ...routeTemplate,
            stopId,
            deptTime: time,
            index: rowIndex + index,
          };
          return;
        }
        res[stopId].deptTime = time;
      });
      return res;
    });
    const inputRoutes = _.sortBy(
      times
        .map((row) => Object.values(row))
        .flat()
        .map((v) => (v.deptTime ? v : { ...v, deptTime: v.arriTime })),
      "index",
    );
    if (!inputRoutes.every((route) => route.deptTime != null)) {
      console.error(
        "Invalid route: Departure time and Arrival time is missing for one stop",
      );
      return;
    }
    setInput(inputRoutes as RoutesArr);
    setDateInput(inputRoutes.map(savedRouteToDateInput));
    setStops(
      _.uniq(
        inputRoutes
          .slice(0, stopNames.length)
          .map((route) => route.stopId)
          .filter((s) => s != undefined),
      ),
    );
  };

  const handleSelectedStopChange = (
    selection: MultiValue<{
      value: number;
      label: string;
    }>,
  ) => {
    setStops(selection.map((s) => s.value));
    setEditedStops(true);
  };

  const handleStopIdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newInput = [...input];
    newInput[index]!.stopId = e.target.valueAsNumber;
    setInput(newInput);
  };
  const handleArrivalTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setDateInput((prev) => {
      const i = [...prev];
      if (i[index]) i[index].arr = e.target.value ?? i[index].arr;
      return i;
    });
    if (e.target.valueAsDate == null) return;
    const newInput = [...input];
    const localDateTime = DateTime.fromFormat(e.target.value, "HH:mm", {
      zone: "utc",
    });
    newInput[index]!.arriTime = localDateTime.toJSDate();
    setInput(newInput);
  };
  const handleClearArrivalTime = (index: number) => {
    const newInput = [...input];
    newInput[index]!.arriTime = undefined;
    setInput(newInput);
    setDateInput((prev) => {
      const i = [...prev];
      if (i[index]) i[index].arr = "";
      return i;
    });
  };
  const handleDepartureTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setDateInput((prev) => {
      const i = [...prev];
      i[index] ??= { arr: "", dep: e.target.value };
      i[index].dep = e.target.value;
      return i;
    });
    if (e.target.value == "") return;
    const newInput = [...input];
    const fixedDateTime = DateTime.fromFormat(e.target.value, "HH:mm", {
      zone: "utc",
    });
    newInput[index]!.deptTime = fixedDateTime.toJSDate();
    setInput(newInput);
  };

  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-row items-center gap-1">
          <p className="text-lg">Bus Stop List </p>
          <a
            data-tooltip-id="bus-list-info"
            data-tooltip-content="This selection will be used to auto fill stops for the bus route."
            data-tooltip-place="top"
          >
            <MdInfoOutline />
          </a>
          <Tooltip id="bus-list-info" />
        </div>
        <div className="text-black">
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={stops?.map((stop) => ({
              value: stop.id,
              label: `${stop.id} ${stop.name}`,
            }))}
            value={(selectedStops ?? []).map((stop) => ({
              value: stop,
              label: `${stop} ${stops?.find((s) => s.id === stop)?.name}`,
            }))}
            // Some dynamic import causes the generic type to be lost
            // Dynamic import is done to prevent hydration errors
            onChange={(val) =>
              handleSelectedStopChange(
                val as MultiValue<{
                  value: number;
                  label: string;
                }>,
              )
            }
            styles={selectStyles}
            placeholder="Select stops..."
          />
        </div>
      </div>
      <br />
      <p className="mb-2 text-lg">Bus Route</p>
      <div className="border-primary relative flex flex-col overflow-scroll rounded-lg border-2 bg-transparent">
        <div className="flex w-full flex-row gap-1 border-x-2 p-1 pt-2">
          <p className="w-20">Index</p>
          <p className="w-20">Stop ID</p>
          <p className="flex-1">Arrival Time</p>
          <p className="flex-1">Departure Time</p>
        </div>
        <div className="border-primary border-t-2 bg-transparent p-1 not-dark:bg-slate-300">
          <div className="flex flex-col gap-1 overflow-hidden rounded-b-sm">
            {input.length == 0 ? (
              <div className="p-8 text-center">No recorded stops</div>
            ) : (
              input.map((route, index) => (
                <div
                  key={index}
                  className="flex w-full flex-row gap-1 overflow-scroll"
                >
                  <div className="bg-border-background flex w-20 flex-col justify-center p-1">
                    <p>{input.at(index)?.index}</p>
                  </div>
                  <input
                    type="number"
                    className="bg-item-background w-20 p-1"
                    placeholder="Stop ID"
                    value={route.stopId ?? 0}
                    onChange={(e) => handleStopIdChange(e, index)}
                    onKeyDown={(e) => {
                      if (e.key != "Enter") return;
                      if (e.metaKey) {
                        addMultipleRoutes();
                        return;
                      }
                      addNewRoute();
                    }}
                  />
                  <div className="bg-item-background flex flex-1 flex-row gap-1">
                    <input
                      type="time"
                      className="flex-1 p-1"
                      id={`arr-${index}`}
                      placeholder="--:--"
                      value={dateInput.at(index)?.arr}
                      onChange={(e) => handleArrivalTimeChange(e, index)}
                      onKeyDown={(e) => {
                        if (e.key != "Enter") return;
                        if (e.metaKey) {
                          addMultipleRoutes();
                          return;
                        }
                        addNewRoute();
                      }}
                    />
                    <button
                      title="Clear Arrival Time"
                      className="pr-2"
                      onClick={() => handleClearArrivalTime(index)}
                    >
                      <MdOutlineClear />
                    </button>
                  </div>
                  <input
                    placeholder="--:--"
                    type="time"
                    className="bg-item-background flex-1 p-1"
                    value={dateInput.at(index)?.dep}
                    onChange={(e) => handleDepartureTimeChange(e, index)}
                    onKeyDown={(e) => {
                      if (e.key != "Enter") return;
                      if (e.metaKey) {
                        addMultipleRoutes();
                        return;
                      }
                      addNewRoute();
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mb-8 flex flex-row pt-2">
        <button
          onClick={handleSubmit}
          className="bg-primary border-primary-foreground text-primary-foreground mr-3 flex flex-row items-center gap-1 rounded-md border-2 p-3 disabled:opacity-50"
          disabled={isPending}
        >
          <IoMdSave />
          Save
        </button>
        <button
          onClick={addNewRoute}
          className="bg-primary border-primary-foreground text-primary-foreground mr-3 flex flex-row items-center gap-1 rounded-md border-2 p-3"
        >
          <MdAddBox />
          Add
        </button>
        <button
          onClick={addMultipleRoutes}
          className="bg-primary border-primary-foreground text-primary-foreground mr-3 flex flex-row items-center gap-1 rounded-md border-2 p-3"
        >
          <MdAddToPhotos />
          Add multiple
        </button>
        <button
          onClick={rmLastRoute}
          className="mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-red-500 bg-red-100 p-3 text-red-500"
        >
          <IoMdTrash color="rgb(239 68 68 / var(--tw-border-opacity))" />
          Remove
        </button>
        <button
          onClick={rmAllRoute}
          className="mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-red-500 bg-red-100 p-3 text-red-500"
        >
          <IoMdTrash color="rgb(239 68 68 / var(--tw-border-opacity))" />
          Remove All
        </button>
        <button
          onClick={() => router.refresh()}
          className="mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-red-500 bg-red-100 p-3 text-red-500"
        >
          <IoMdRefreshCircle color="rgb(239 68 68 / var(--tw-border-opacity))" />
          Revert Changes
        </button>
      </div>
      <EditRoutesByFile onParse={handleFileParse} />
    </>
  );
}

export default EditBusRoute;
