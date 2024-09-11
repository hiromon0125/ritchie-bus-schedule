"use client";
import type { Bus, Routes } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { IoMdSave, IoMdTrash } from "react-icons/io";
import {
  MdAddBox,
  MdAddToPhotos,
  MdInfoOutline,
  MdOutlineClear,
} from "react-icons/md";
import Select, { type StylesConfig } from "react-select";
import { Tooltip } from "react-tooltip";
import { api } from "t/react";
import type { RouterOutputs } from "t/shared";
import { z } from "zod";

type RouteObj = Routes;
type RouteInput = Partial<RouteObj> & Pick<RouteObj, "index" | "busId">;
type RoutesArr = RouteInput[];

const selectStyles: StylesConfig<{ value: number }, true> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    ":hover": {
      borderColor: "black",
      backgroundColor: "rgb(226 232 240 / var(--tw-bg-opacity))",
    },
  }),
};

function createNewRoute(stops: number[], input: RoutesArr, busId: number) {
  const newRoute = {
    ...(input[input.length - 1] ?? {
      busId,
      stopId: stops[0] ?? 0,
      index: 0,
      deptTime: new Date(),
    }),
  };
  newRoute.index += 1;
  newRoute.arriTime = undefined;
  const indStop = newRoute.stopId ? stops.indexOf(newRoute.stopId) : -1;
  let nextStop = stops[indStop + 1];
  newRoute.stopId = nextStop ?? stops[0] ?? 0;
  if (!nextStop && indStop !== stops.length - 1) {
    return newRoute;
  } else if (indStop === stops.length - 1) {
    nextStop = stops[0];
  }
  const lastInstance = _.findLastIndex(
    input,
    (route) => route.stopId === nextStop,
  );
  if (lastInstance === -1 || lastInstance === 0) {
    return newRoute;
  }
  const timeDiff =
    (input[lastInstance]!.deptTime?.getTime() ?? 0) -
    (input[lastInstance - 1]!.deptTime?.getTime() ?? 0);
  newRoute.deptTime = new Date((newRoute.deptTime?.getTime() ?? 0) + timeDiff);
  if (
    input[lastInstance]!.arriTime &&
    lastInstance - stops.length > 0 &&
    input[lastInstance - stops.length]!.arriTime
  ) {
    const timeDiff =
      (input[lastInstance]!.arriTime?.getTime() ?? 0) -
      (input[lastInstance - stops.length]?.arriTime?.getTime() ?? 0);
    const newArriTime = new Date(
      input[lastInstance]?.arriTime?.getTime() ?? 0 + timeDiff,
    );
    newRoute.arriTime = newArriTime;
  }
  return newRoute;
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

function EditBusRoute({ bus }: { bus: Bus }) {
  const busId = bus.id;
  const { data: storedStops, isLoading } = api.stops.getStopsByBusID.useQuery({
    busId: bus.id,
  });
  const storedStopsId = storedStops?.map((e) => e.id) ?? [];
  const { data } = api.routes.getAllByBusId.useQuery(
    { busId },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const { data: stops, refetch: refecthData } = api.stops.getAll.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const { mutate, status: savingState } = api.routes.updateRoutes.useMutation();
  const [edtedSelectedStops, setEditedStops] = useState(false);
  const [selectedStops, setStops] = useState(storedStopsId);
  const [input, setInput] = useState<RoutesArr>(savedRouteToInput(data));

  useEffect(() => {
    if (!edtedSelectedStops) {
      setStops(storedStopsId);
    }
  }, [isLoading]);
  useEffect(() => {
    setInput(savedRouteToInput(data));
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
        .parse(input)
        .map((route) => {
          const { arriTime, deptTime, ...rest } = route;
          return {
            ...rest,
            arriTime: arriTime
              ? new Date(
                  Date.UTC(0, 0, 0, arriTime.getHours(), arriTime.getMinutes()),
                )
              : undefined,
            deptTime: new Date(
              Date.UTC(0, 0, 0, deptTime.getHours(), deptTime.getMinutes()),
            ),
          };
        });

      mutate({
        routes: definedInput,
        busId,
        stopIds: selectedStops,
      });
      await refecthData();
    } catch (e) {
      // catch if the input is invalid or attribute is missing
      console.error(e);
    }
  };

  const addNewRoute = () =>
    setInput([...input, createNewRoute(selectedStops, input, busId)]);

  const addMultipleRoutes = () => {
    const currInput = [...input];
    selectedStops.forEach((_) =>
      currInput.push(createNewRoute(selectedStops, currInput, busId)),
    );
    setInput(currInput);
  };

  const rmRoute = () => setInput(input.slice(0, -1));

  return (
    <>
      <div className=" mt-4 flex flex-col gap-2">
        <div className=" flex flex-row items-center gap-1">
          <p className=" text-lg">Bus Stop List </p>
          <a
            data-tooltip-id="bus-list-info"
            data-tooltip-content="This selection will be used to auto fill stops for the bus route."
            data-tooltip-place="top"
          >
            <MdInfoOutline />
          </a>
          <Tooltip id="bus-list-info" />
        </div>
        <Select
          isMulti
          closeMenuOnSelect={false}
          options={stops?.map((stop) => ({
            value: stop.id,
            label: `${stop.id} ${stop.name}`,
          }))}
          value={selectedStops.map((stop) => ({
            value: stop,
            label: `${stop} ${stops?.find((s) => s.id === stop)?.name}`,
          }))}
          onChange={(selection) => {
            setStops(selection.map((s) => s.value));
            setEditedStops(true);
          }}
          styles={selectStyles}
          placeholder="Select stops..."
        />
      </div>
      <br />
      <p className=" mb-2 text-lg">Bus Route</p>
      <div className=" relative flex flex-col overflow-scroll rounded-lg border-2 border-black bg-slate-200">
        <div className=" flex w-full flex-row gap-1 border-x-2 p-1 pt-2">
          <p className=" w-20">Index</p>
          <p className=" w-20">Stop ID</p>
          <p className=" flex-1">Arrival Time</p>
          <p className=" flex-1">Departure Time</p>
        </div>
        <div className=" border-t-2 border-black bg-slate-300 p-1">
          <div className=" flex flex-col gap-1 overflow-hidden rounded-b-sm">
            {input.length == 0 ? (
              <div className=" p-2">No recorded stops</div>
            ) : (
              input.map((route, index) => (
                <div
                  key={index}
                  className="flex w-full flex-row gap-1 overflow-scroll "
                >
                  <div className=" flex w-20 flex-col justify-center bg-slate-200 p-1">
                    <p>{input.at(index)?.index}</p>
                  </div>
                  <input
                    type="number"
                    className="w-20 p-1"
                    placeholder="Stop ID"
                    value={route.stopId ?? 0}
                    onChange={(e) => {
                      const newInput = [...input];
                      newInput[index]!.stopId = e.target.valueAsNumber;
                      setInput(newInput);
                    }}
                  />
                  <div className=" flex flex-1 flex-row gap-1 bg-white">
                    <input
                      type="time"
                      className=" flex-1 p-1"
                      id={`arr-${index}`}
                      placeholder="--:--"
                      value={
                        input[index]!.arriTime != undefined
                          ? DateTime.fromJSDate(
                              input[index]!.arriTime,
                            ).toFormat("HH:mm")
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.valueAsDate === null) return;
                        const newInput = [...input];
                        newInput[index]!.arriTime = new Date(
                          `01/01/1970 ${e.target.value}`,
                        );
                        setInput(newInput);
                      }}
                    />
                    <button
                      title="Clear Arrival Time"
                      className=" pr-2"
                      onClick={(_) => {
                        const newInput = [...input];
                        newInput[index]!.arriTime = undefined;
                        setInput(newInput);
                        const inputElement = document.getElementById(
                          `arr-${index}`,
                        ) as HTMLInputElement;
                        inputElement.value = "";
                      }}
                    >
                      <MdOutlineClear />
                    </button>
                  </div>
                  <input
                    placeholder="--:--"
                    type="time"
                    className="flex-1 p-1"
                    value={
                      input[index]!.deptTime != undefined
                        ? DateTime.fromJSDate(input[index]!.deptTime).toFormat(
                            "HH:mm",
                          )
                        : ""
                    }
                    onChange={(e) => {
                      if (e.target.value === null) return;
                      const newInput = [...input];
                      newInput[index]!.deptTime = new Date(
                        `01/01/1970 ${e.target.value}`,
                      );
                      setInput(newInput);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className=" mb-8 flex flex-row pt-2">
        <button
          onClick={handleSubmit}
          className=" mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800 disabled:opacity-50"
          disabled={savingState === "loading"}
        >
          <IoMdSave />
          Save
        </button>
        <button
          onClick={addNewRoute}
          className=" mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          <MdAddBox />
          Add
        </button>
        <button
          onClick={addMultipleRoutes}
          className=" mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          <MdAddToPhotos />
          Add multiple
        </button>
        <button
          onClick={rmRoute}
          className=" mr-3 flex flex-row items-center gap-1 rounded-md border-2 border-red-500 bg-red-100 p-3 text-red-500"
        >
          <IoMdTrash color="rgb(239 68 68 / var(--tw-border-opacity))" />
          Remove
        </button>
      </div>
    </>
  );
}

export default EditBusRoute;
