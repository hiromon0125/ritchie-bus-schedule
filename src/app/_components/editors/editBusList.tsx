"use client";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RouterInputs } from "t/react";
import { api } from "t/react";
import { Switch } from "../../../components/ui/switch";

function EditBusList() {
  const router = useRouter();
  const { mutateAsync: createBus, isPending } = api.bus.addBus.useMutation();
  const { mutateAsync: editBus } = api.bus.editBus.useMutation();
  const { mutateAsync: deleteBus } = api.bus.deleteBus.useMutation();
  const { data, refetch, status } = api.bus.getAll.useQuery({
    isVisible: undefined,
  });
  const loading = status === "pending" || isPending;
  const [newBus, setNewBus] = useState<RouterInputs["bus"]["addBus"]>({
    id: (_.max(data?.map((bus) => bus.id)) ?? 0) + 1,
    name: "",
    description: "",
    color: "#000000",
  });
  const validation = !!newBus.name && !!newBus.description;

  const handleSubmit = async () => {
    if (!newBus.name || !newBus.description) {
      return;
    }
    await createBus(newBus);
    await refetch();
    if (status === "success") {
      setNewBus({
        id: (_.max(data?.map((bus) => bus.id)) ?? 0) + 1,
        name: "",
        description: "",
        color: "#000000",
      });
    }
  };

  const handleDelete = async (bus: RouterInputs["bus"]["deleteBus"]) => {
    await deleteBus(bus);
    await refetch();
  };

  return (
    <>
      <div className=" flex w-full flex-row flex-wrap gap-2 bg-transparent">
        <div className=" flex flex-row items-center gap-3 rounded-md border-2 border-black bg-transparent px-4 py-2">
          <p>Color</p>
          <input
            className=" "
            type="color"
            placeholder="#000000"
            value={newBus.color}
            onChange={(e) => {
              setNewBus({
                ...newBus,
                color: e.target.value,
              });
            }}
            disabled={loading}
          />
        </div>
        <input
          className=" w-20 rounded-md border-2 border-black bg-transparent px-4 py-2"
          type="number"
          placeholder="ID"
          value={newBus.id}
          onChange={(e) => {
            setNewBus({
              ...newBus,
              id: parseInt(e.target.value),
            });
          }}
          disabled={loading}
        />
        <input
          className=" grow-2 rounded-md border-2 border-black bg-transparent px-4 py-2"
          type="text"
          placeholder="Name"
          value={newBus.name}
          onChange={(e) => {
            setNewBus({
              ...newBus,
              name: e.target.value,
            });
          }}
          disabled={loading}
        />
        <input
          className=" min-w-80 grow-4 rounded-md border-2 border-black bg-transparent px-4 py-2"
          type="text"
          placeholder="Description"
          value={newBus.description}
          onChange={(e) => {
            setNewBus({
              ...newBus,
              description: e.target.value,
            });
          }}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          className=" rounded-lg border-2 border-black bg-black p-2 text-white"
          style={
            !validation || loading
              ? {
                  opacity: 0.5,
                  color: "grey",
                }
              : {
                  opacity: 1,
                  color: "white",
                }
          }
          disabled={!validation || loading}
        >
          Add Bus
        </button>
      </div>
      <div className=" mt-4 overflow-clip rounded-md border-2 border-black">
        {data?.map((bus, index) => (
          <div key={bus.id}>
            <div
              key={bus.id}
              className=" relative flex h-10 w-full flex-row items-center gap-3"
            >
              <div
                className=" h-full w-8"
                style={{ backgroundColor: bus.color ?? "#000000" }}
              />
              <p className=" flex-1 text-nowrap">
                {bus.id} {bus.name}
              </p>
              <Switch
                checked={bus.isVisible}
                onClick={async () => {
                  await editBus({
                    ...bus,
                    isVisible: !bus.isVisible,
                  });
                  await refetch();
                }}
              />
              <p className=" text-slate-800">Visible</p>
              <button
                onClick={() => router.push(`/manage/bus/${bus.id}`)}
                className=" m-2 rounded-sm border border-black px-2 py-1 hover:bg-slate-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(bus)}
                className=" m-2 ml-[-12px] rounded-sm border border-red-500 px-2 py-1 text-red-500 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
            {index !== data.length - 1 && (
              <hr className=" border-1 border-black" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default EditBusList;
