"use client";
import _ from "lodash";
import { useEffect, useState } from "react";
import { api } from "t/react";
import type { RouterOutputs } from "t/shared";

type InputStop = Partial<RouterOutputs["stops"]["getAll"][0]> & {
  saved: boolean;
  name: string;
};

export default function EditStopList() {
  const { data: savedList, refetch } = api.stops.getAll.useQuery();
  const { mutateAsync: save, isLoading } = api.stops.addBusStop.useMutation();
  const [list, setList] = useState<InputStop[]>(
    savedList?.map((o) => ({ ...o, name: o.name ?? "", saved: true })) ?? [],
  );

  const addNewStop = () => {
    const newStop = {
      name: "",
      saved: false,
    };
    setList((ls) => [...ls, newStop]);
  };

  const saveStops = async () => {
    const stops = _.filter(list, { saved: false });
    await Promise.all(stops.map((stop) => save(stop)));
    setList((ls) => ls.map((o) => ({ ...o, saved: true })));
    await refetch();
  };

  useEffect(() => {
    if (savedList) {
      setList((ls) => {
        const unsavedList = _.filter(ls, { saved: false });
        return [
          ...unsavedList,
          ...savedList.map((o) => ({ ...o, name: o.name ?? "", saved: true })),
        ];
      });
    }
  }, [savedList]);

  return (
    <div className=" flex w-full flex-col flex-wrap gap-2 bg-transparent">
      <div className=" flex flex-row items-center gap-3 rounded-md border-2 border-black bg-transparent px-4 py-2">
        <button
          className=" w-12 border-r-2 border-black pr-3"
          onClick={addNewStop}
        >
          Add
        </button>
        <button onClick={saveStops} disabled={isLoading}>
          Save
        </button>
      </div>
      <div className=" flex flex-col items-start rounded-md border-2 border-black bg-transparent px-4 py-2">
        <div className=" flex w-full flex-row gap-3 border-b-2 border-black">
          <p className=" w-12 border-r-2 border-black">ID</p>
          <p>Name</p>
        </div>
        {list.length == 0 ? (
          <div className=" p-2 pl-0">No Stops</div>
        ) : (
          list.map((stop, index) => (
            <div className=" flex w-full flex-row">
              <p className=" w-12 border-r-2 border-black py-1">
                {stop.id ?? "--"}
              </p>
              <input
                className=" flex-1 bg-transparent py-1 pl-3"
                value={stop.name}
                onChange={(e) =>
                  setList((ls) => {
                    const newList = [...ls];
                    newList[index]!.name = e.target.value;
                    return newList;
                  })
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
