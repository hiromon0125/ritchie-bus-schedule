"use client";
import _ from "lodash";
import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "t/react";
import { useDebounceValue } from "usehooks-ts";
import { Switch } from "../../../components/ui/switch";

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
  const { data, status: fetchStatus } = api.bus.getByID.useQuery({
    id: busId,
    isVisible: undefined,
  });
  const { mutate } = api.bus.editBus.useMutation();
  const [newData, setNewData] = useState<Bus | null>(data ?? null);
  const [savedData] = useDebounceValue(newData, 1000);
  useEffect(() => {
    if (fetchStatus === "success" && savedData && !_.isEqual(savedData, data)) {
      mutate(savedData);
    }
  }, [savedData, data, fetchStatus, mutate]);
  useEffect(() => {
    setNewData(data ?? null);
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // TODO: find the correct solution for the types here without the as keyword
  function handleInput(data: Partial<Bus>) {
    setNewData((oldData) => ({ ...oldData, ...data }) as Bus);
  }

  return (
    <div className=" flex w-full max-w-screen-lg flex-col gap-3">
      <div className=" relative flex h-[85px] w-full flex-row gap-5 py-2 pl-0">
        <label htmlFor="color" className=" flex h-full flex-col gap-1">
          <p>Color</p>
          <input
            id="color"
            value={newData?.color ?? "#000000"}
            onChange={(e) => newData && handleInput({ color: e.target.value })}
            type="color"
            className=" h-full rounded-md border-2 border-black bg-white text-xl"
          />
        </label>
        <label htmlFor="name" className=" flex flex-1 flex-col gap-1">
          <p>Name</p>
          <input
            id="name"
            value={newData?.name ?? ""}
            onChange={(e) => newData && handleInput({ name: e.target.value })}
            className=" flex-1 rounded-md border-2 border-black bg-white p-2 text-xl"
          />
        </label>
      </div>
      <label htmlFor="description" className=" flex flex-col gap-1">
        <p>Description</p>
        <textarea
          id="description"
          value={newData?.description ?? ""}
          onChange={(e) =>
            newData && handleInput({ description: e.target.value })
          }
          className=" text-md h-32 w-full resize-none rounded-md border-2 border-black bg-white p-2"
        />
      </label>
      <div>
        <div className=" flex flex-row items-center gap-3">
          <p>Visible</p>
          <Switch
            checked={newData?.isVisible}
            onClick={() =>
              newData && handleInput({ isVisible: !newData.isVisible })
            }
          />
        </div>
      </div>
    </div>
  );
}
