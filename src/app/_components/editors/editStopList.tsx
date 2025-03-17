"use client";
import _ from "lodash";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import type { RouterOutputs } from "t/react";
import { api } from "t/react";

type InputStop = Partial<RouterOutputs["stops"]["getAll"][0]> & {
  saved: boolean;
  name: string;
};

export default function EditStopList() {
  const { data: savedList, refetch } = api.stops.getAll.useQuery();
  const { mutateAsync: save, isPending } = api.stops.addBusStop.useMutation();
  const { mutateAsync: deleteStop } = api.stops.deleteBusStop.useMutation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [onUserFocused, setOnUserFocused] = useState(false);
  const [list, setList] = useState<InputStop[]>(
    savedList?.map((o) => ({
      ...o,
      name: o.name ?? "",
      description: o.description ?? "",
      saved: true,
    })) ?? [],
  );

  let focusTimeout: NodeJS.Timeout | null = null;
  function focusOnLastInput() {
    if (focusTimeout) {
      clearTimeout(focusTimeout);
    }
    const focus = () => {
      const inputs = document.getElementsByClassName(
        "stop-input",
      ) as HTMLCollectionOf<HTMLInputElement>;
      const input = inputs[inputs.length - 1];
      if (!input) {
        focusTimeout = setTimeout(focus, 1);
        return;
      }
      input.focus();
    };
    focus();
  }

  const addNewStop = () => {
    const newStop = {
      name: "",
      description: "",
      saved: false,
    };
    setList((ls) => [...ls, newStop]);
    focusOnLastInput();
  };

  const saveStops = async () => {
    const stops = _.filter(list, { saved: false });
    await Promise.all(
      stops.map((stop) =>
        save({
          ...stop,
          description: stop.description ?? "",
          name: stop.name ?? "",
          tag: stop.tag ?? undefined,
        }),
      ),
    );
    setList((ls) => ls.map((o) => ({ ...o, saved: true })));
    await refetch();
  };

  const onDelete = async (index: number) => {
    let stop;
    if ((stop = list.at(index))?.saved && stop.id) {
      // delete from db
      await deleteStop({ id: stop.id });
      await refetch();
    } else {
      setList((ls) => {
        const newList = [...ls];
        newList.splice(index, 1);
        return newList;
      });
    }
  };

  useEffect(() => {
    if (savedList) {
      setList((ls) => {
        const unsavedList = _.filter(ls, { saved: false });
        return [
          ...savedList.map((o) => ({ ...o, name: o.name ?? "", saved: true })),
          ...unsavedList,
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
        <button onClick={saveStops} disabled={isPending}>
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
            <div
              className=" even:bg-border-background flex w-full flex-row"
              key={index}
              onMouseEnter={() => !onUserFocused && setHoveredIndex(index)}
              onMouseLeave={() => !onUserFocused && setHoveredIndex(null)}
            >
              <p className=" w-12 border-r-2 border-black py-1">
                {stop.id ?? "--"}
              </p>
              <input
                placeholder="Stop Name"
                className=" stop-input flex-1 bg-transparent py-1 pl-3"
                value={stop.name}
                onChange={(e) =>
                  setList((ls) => {
                    const newList = [...ls];
                    newList[index]!.name = e.target.value;
                    return newList;
                  })
                }
                onFocus={() => {
                  setOnUserFocused(true);
                  setHoveredIndex(index);
                }}
                onBlur={() => setOnUserFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && addNewStop()}
              />
              {hoveredIndex !== index ? null : (
                <>
                  <Link
                    href={`/manage/stop/${stop.id}`}
                    className=" text-black-600 bg-item-background mr-1 flex flex-row items-center gap-2 rounded-md border-2 border-black px-1"
                  >
                    Edit
                  </Link>
                  <button
                    className=" bg-item-background mr-1 flex flex-row items-center gap-2 rounded-md border-2 border-red-600 px-1 text-red-600"
                    onClick={() => onDelete(index)}
                  >
                    <FaTrash color="red" />
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
