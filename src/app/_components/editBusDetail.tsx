"use client";
import { useDebounce } from "@uidotdev/usehooks";
import _ from "lodash";
import { useEffect, useState } from "react";
import { api } from "t/react";
import { type RouterOutputs } from "t/shared";

type Bus = Omit<
  NonNullable<RouterOutputs["bus"]["getByID"]>,
  "createdAt" | "updatedAt"
> &
  Partial<
    Pick<
      NonNullable<RouterOutputs["bus"]["getByID"]>,
      "createdAt" | "updatedAt"
    >
  >;

export default function EditBusDetail({ busId }: { busId: number }) {
  const { data, status: fetchStatus } = api.bus.getByID.useQuery({ id: busId });
  const { mutate } = api.bus.editBus.useMutation();
  const [newData, setNewData] = useState<Bus | null>(data ?? null);
  const savedData = useDebounce(newData, 1000);
  useEffect(() => {
    fetchStatus === "success" &&
      savedData &&
      !_.isEqual(savedData, data) &&
      mutate(savedData);
  }, [savedData]);
  useEffect(() => {
    setNewData(data ?? null);
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  function handleInput(data: Bus) {
    setNewData((oldData) => ({ ...oldData, ...data }));
  }

  return (
    <div className=" flex w-full max-w-screen-lg flex-col gap-3">
      <div className=" relative flex h-[85px] w-full flex-row gap-5 py-2 pl-0">
        <label htmlFor="color" className=" flex h-full flex-col gap-1">
          <p>Color</p>
          <input
            id="color"
            value={newData?.color ?? "#000000"}
            onChange={(e) =>
              newData && handleInput({ ...newData, color: e.target.value })
            }
            type="color"
            className=" h-full rounded-md border-2 border-black bg-white text-xl"
          />
        </label>
        <label htmlFor="name" className=" flex flex-1 flex-col gap-1">
          <p>Name</p>
          <input
            id="name"
            value={newData?.name ?? ""}
            onChange={(e) =>
              newData && handleInput({ ...newData, name: e.target.value })
            }
            className=" flex-1 rounded-md border-2 border-black bg-white p-2 text-xl"
          />
        </label>
      </div>
      <label htmlFor="description" className=" flex flex-col gap-1">
        <p>Description</p>
        <textarea
          value={newData?.description ?? ""}
          onChange={(e) =>
            newData && handleInput({ ...newData, description: e.target.value })
          }
          className=" text-md h-32 w-full resize-none rounded-md border-2 border-black bg-white p-2"
        />
      </label>
    </div>
  );
}
