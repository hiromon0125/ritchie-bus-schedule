"use client";
import _ from "lodash";
import { useEffect, useState } from "react";
import { api, type RouterInputs, type RouterOutputs } from "t/react";
import { useDebounceValue } from "usehooks-ts";
import { Switch } from "../../../components/ui/switch";
import DayOfWeekSelector from "./dayOfWeekSelector";

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

type NewBus = RouterInputs["bus"]["editBus"];
type IdLessBus = Omit<NewBus, "id">;

export default function EditBusDetail({ busId }: { busId: number }) {
  const { data, status: fetchStatus } = api.bus.getByID.useQuery({
    id: busId,
    isVisible: undefined,
    includeDays: true,
  });
  const { mutate } = api.bus.editBus.useMutation();
  const [newData, setNewData] = useState<Bus | null | undefined>(() => data);
  const [unsavedData, setUnsavedData] = useState<IdLessBus>({});
  const [debouncedUnsavedData] = useDebounceValue(unsavedData, 1000);
  useEffect(() => {
    if (
      fetchStatus === "success" &&
      data &&
      Object.keys(debouncedUnsavedData).length != 0
    ) {
      mutate({ id: busId, ...debouncedUnsavedData });
      setUnsavedData((prev) => {
        const ud = { ...prev };
        const udKeys = Object.keys(ud) as (keyof IdLessBus)[];
        const savedKeys = (
          Object.keys(debouncedUnsavedData) as (keyof IdLessBus)[]
        ).filter((k) => udKeys.includes(k));
        savedKeys.forEach((k) => delete ud[k]);
        return ud;
      });
    }
  }, [busId, data, fetchStatus, mutate, debouncedUnsavedData]);
  useEffect(() => {
    if (data != null) setNewData(data);
  }, [data]);

  if (!data) return <div>Loading...</div>;

  function handleInput(data: IdLessBus) {
    setNewData(
      (oldData) =>
        ({
          ...oldData,
          ..._.pickBy(data, (o) => o != undefined),
        }) as Bus,
    );
    setUnsavedData((prev) => ({ ...prev, ...data }));
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
      <div className=" flex flex-col gap-3">
        <div className=" flex flex-row items-center gap-3">
          <p>Visible</p>
          <Switch
            checked={newData?.isVisible}
            onClick={() =>
              newData && handleInput({ isVisible: !newData.isVisible })
            }
          />
        </div>
        <div className=" flex flex-col gap-3">
          <DayOfWeekSelector
            operatingDays={data.operatingDays}
            onChange={(newDays) =>
              newData &&
              handleInput({
                operatingDays: newDays.map((o) => ({ ...o, busId })),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
