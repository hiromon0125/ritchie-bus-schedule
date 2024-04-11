"use client";
import _ from "lodash";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type RouterInputs } from "../../trpc/shared";

type RouteObj = RouterInputs["routes"]["addRoutes"][0];
type RoutesArr = RouterInputs["routes"]["addRoutes"];

function createNewDate(): Date {
  const date = new Date();
  date.setFullYear(2024);
  date.setMonth(1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function createNewRoute(stops: number[], input: RoutesArr) {
  const newRoute = {
    ...(input[input.length - 1] ?? {
      busId: 0,
      stopId: stops[0] ?? 0,
      index: 0,
      deptTime: createNewDate(),
    }),
  };
  newRoute.index += 1;
  newRoute.arriTime = undefined;
  const indStop = stops.indexOf(newRoute.stopId);
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
    input[lastInstance]!.deptTime.getTime() -
    input[lastInstance - 1]!.deptTime.getTime();
  newRoute.deptTime = new Date(newRoute.deptTime.getTime() + timeDiff);
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
  const { mutate } = api.routes.addRoutes.useMutation();
  const [stops, setStops] = useState<number[]>([]);
  const [input, setInput] = useState<RouteObj[]>([]);

  const handleSubmit = () => {
    mutate(input);
    setInput(new Array<RouteObj>());
  };

  const addNewRoute = () => {
    const newRoute = createNewRoute(stops, input);
    setInput([...input, newRoute]);
  };

  const addMultipleRoutes = () => {
    const currInput = [...input];
    stops.forEach((_) => {
      const newRoute = createNewRoute(stops, currInput);
      currInput.push(newRoute);
    });
    setInput(currInput);
  };

  const rmRoute = () => {
    setInput(input.slice(0, -1));
  };

  const addNewStop = () => {
    setStops([...stops, 0]);
  };
  const rmStop = () => {
    setStops(stops.slice(0, -1));
  };

  return (
    <>
      <div>
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
                  newStops[index] = parseInt(e.target.value);
                  return newStops;
                });
              }}
            />
          ))}
        </div>
        <br />
        <button
          onClick={addNewStop}
          className=" mr-3 bg-slate-200 p-3 text-slate-800"
        >
          add
        </button>
        <button onClick={rmStop} className=" bg-slate-200 p-3 text-slate-800">
          remove
        </button>
      </div>
      <br />
      <div className="flex flex-col gap-3 overflow-scroll bg-slate-200">
        <div className=" flex max-w-3xl flex-row gap-3 ">
          <p className=" w-20">Bus ID</p>
          <p className=" w-20">Stop ID</p>
          <p className=" w-20">Index</p>
          <p className=" w-52">Arrival Time</p>
          <p>Departure Time</p>
        </div>
        {input.map((route, index) => (
          <div
            key={index}
            className="flex max-w-3xl flex-row gap-3 overflow-scroll bg-slate-200"
          >
            <input
              type="number"
              className="w-20 "
              placeholder="Bus ID"
              value={route.busId}
              onChange={(e) => {
                const newInput = [...input];
                newInput[index]!.busId = parseInt(e.target.value);
                setInput(newInput);
              }}
            />
            <input
              type="number"
              className="w-20 "
              placeholder="Stop ID"
              value={route.stopId}
              onChange={(e) => {
                const newInput = [...input];
                newInput[index]!.stopId = parseInt(e.target.value);
                setInput(newInput);
              }}
            />
            <input
              type="number"
              className=" w-20 "
              placeholder="Index"
              value={route.index}
              onChange={(e) => {
                const newInput = [...input];
                newInput[index]!.index = parseInt(e.target.value);
                setInput(newInput);
              }}
            />
            <input
              type="datetime-local"
              className="flex-grow-1 "
              placeholder="Arrival Time"
              value={route.arriTime?.toISOString().slice(0, -5)}
              onChange={(e) => {
                const newInput = [...input];
                newInput[index]!.arriTime = new Date(
                  `${e.target.value}:00.000Z`,
                );
                setInput(newInput);
              }}
            />
            <input
              type="datetime-local"
              className="flex-grow-1 "
              placeholder="Departure Time"
              value={route.deptTime.toISOString().slice(0, -5)}
              onChange={(e) => {
                const newInput = [...input];
                newInput[index]!.deptTime = new Date(
                  `${e.target.value}:00.000Z`,
                );
                setInput(newInput);
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className=" mr-3 bg-slate-200 p-3 text-slate-800"
      >
        Submit
      </button>
      <button
        onClick={addNewRoute}
        className=" mr-3 bg-slate-200 p-3 text-slate-800"
      >
        add
      </button>
      <button
        onClick={addMultipleRoutes}
        className=" mr-3 bg-slate-200 p-3 text-slate-800"
      >
        add multiple
      </button>
      <button
        onClick={rmRoute}
        className=" mr-3 bg-slate-200 p-3 text-slate-800"
      >
        remove
      </button>
    </>
  );
}

export default EditBusRoute;
