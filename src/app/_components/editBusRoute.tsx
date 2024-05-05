"use client";
import _ from "lodash";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "t/react";
import { type RouterInputs } from "t/shared";
import { z } from "zod";

type RouteObj = RouterInputs["routes"]["updateRoutes"][0];
type RouteInput = Partial<RouteObj> & Pick<RouteObj, "index" | "busId">;
type RoutesArr = RouteInput[];

function createNewDate(): Date {
  const date = new Date();
  date.setFullYear(2024);
  date.setMonth(1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function createNewRoute(stops: number[], input: RoutesArr, busId: number) {
  const newRoute = {
    ...(input[input.length - 1] ?? {
      busId,
      stopId: stops[0] ?? 0,
      index: 0,
      deptTime: createNewDate(),
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
      (input[lastInstance - stops.length]!.arriTime?.getTime() ?? 0);
    const newArriTime = new Date(
      input[lastInstance]!.arriTime!.getTime() + timeDiff,
    );
    newRoute.arriTime = newArriTime;
  }
  return newRoute;
}

function EditBusRoute({ busId }: { busId: number }) {
  const { data } = api.routes.getAllByBusId.useQuery({ busId });
  const { mutate } = api.routes.updateRoutes.useMutation();
  const [stops, setStops] = useState<number[]>([]);
  const [input, setInput] = useState<RoutesArr>(
    () =>
      data?.map(
        (route) =>
          ({
            ...route,
            arriTime: route.arriTime ?? undefined,
          }) as RouteInput,
      ) ?? [],
  );

  const handleSubmit = () => {
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
      mutate(definedInput);
      setInput(new Array<RouteObj>());
    } catch (e) {
      // catch if the input is invalid or attribute is missing
      console.error(e);
    }
  };

  const addNewRoute = () =>
    setInput([...input, createNewRoute(stops, input, busId)]);

  const addMultipleRoutes = () => {
    const currInput = [...input];
    stops.forEach((_) =>
      currInput.push(createNewRoute(stops, currInput, busId)),
    );
    setInput(currInput);
  };

  const rmRoute = () => setInput(input.slice(0, -1));

  const addNewStop = () => setStops([...stops, 0]);

  const rmStop = () => setStops(stops.slice(0, -1));

  return (
    <>
      <div className=" mt-4">
        <div className=" max-w-3xl overflow-scroll">
          {stops.map((bus, index) => (
            <input
              key={index}
              type="number"
              className="w-20 "
              placeholder="Stop ID"
              value={bus}
              onChange={(e) => {
                setStops((stops) => {
                  const newStops = [...stops];
                  newStops[index] = e.target.valueAsNumber ?? 0;
                  return newStops;
                });
              }}
            />
          ))}
        </div>
        <br />
        <button
          onClick={addNewStop}
          className=" mr-3 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          add
        </button>
        <button
          onClick={rmStop}
          className=" mr-3 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          remove
        </button>
      </div>
      <br />
      <div className=" relative flex flex-col overflow-scroll rounded-lg border-2 border-black bg-slate-200">
        <div className=" flex w-full flex-row gap-1 border-x-2 p-1 pt-2">
          <p className=" w-20">Stop ID</p>
          <p className=" w-20">Index</p>
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
                  <input
                    type="number"
                    className=" w-20 p-1"
                    placeholder="Index"
                    value={route.index}
                    onChange={(e) => {
                      const newInput = [...input];
                      newInput[index]!.index = e.target.valueAsNumber;
                      setInput(newInput);
                    }}
                  />
                  <div className=" flex flex-1 flex-row gap-1 bg-white">
                    <input
                      type="time"
                      className=" flex-1 p-1"
                      id={`arr-${index}`}
                      onChange={(e) => {
                        if (e.target.valueAsDate === null) return;
                        const newInput = [...input];
                        newInput[index]!.arriTime = e.target.valueAsDate;
                        setInput(newInput);
                      }}
                    />
                    <button
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
                      X
                    </button>
                  </div>
                  <input
                    type="time"
                    className="flex-1 p-1"
                    onChange={(e) => {
                      console.log(e.target.valueAsDate);
                      if (e.target.valueAsDate === null) return;
                      const newInput = [...input];
                      newInput[index]!.deptTime = e.target.valueAsDate;
                      setInput(newInput);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className=" pt-2">
        <button
          onClick={handleSubmit}
          className=" mr-3 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          Submit
        </button>
        <button
          onClick={addNewRoute}
          className=" mr-3 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          Add
        </button>
        <button
          onClick={addMultipleRoutes}
          className=" mr-3 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          Add multiple
        </button>
        <button
          onClick={rmRoute}
          className=" mr-3 rounded-md border-2 border-black bg-slate-200 p-3 text-slate-800"
        >
          Remove
        </button>
      </div>
    </>
  );
}

export default EditBusRoute;
