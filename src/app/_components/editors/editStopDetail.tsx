"use client";

import _ from "lodash";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Draggable, Map } from "pigeon-maps";
import { useState } from "react";
import Select from "react-select";
import { api } from "t/react";
import type { RouterOutputs } from "t/shared";
import { useToast } from "~/hooks/use-toast";
import selectStyles from "~/styles/selectStyle";

const RIT_CENTER = {
  lat: 43.085284,
  lng: -77.668755,
};

type DetailedStop = NonNullable<RouterOutputs["stops"]["getOneByID"]>;

export default function EditStopDetail({ stop }: { stop: DetailedStop }) {
  const [editedStop, setEditedStop] = useState<DetailedStop>({ ...stop });
  const { mutateAsync: save } = api.stops.editBusStop.useMutation();
  const { mutateAsync: deleteStop } = api.stops.deleteBusStop.useMutation();
  const { toast } = useToast();

  return (
    <div className=" relative flex flex-col gap-2">
      <h1 className=" my-0 mt-3 text-xl">Stop ID: {stop.id}</h1>
      <div className=" flex w-full flex-row gap-3">
        <input
          type="text"
          className=" w-full text-nowrap rounded-lg border-2 border-black p-2 text-3xl"
          placeholder="Name"
          value={editedStop.name}
          onChange={(e) =>
            setEditedStop({ ...editedStop, name: e.target.value })
          }
        />
      </div>
      <textarea
        className=" min-h-24 text-wrap rounded-lg border-2 border-black p-2 text-xl"
        value={editedStop.description}
        placeholder="Description"
        onChange={(e) =>
          setEditedStop({ ...editedStop, description: e.target.value })
        }
      />
      <div className=" mt-4 rounded-md border-2 border-black bg-white p-2">
        <h2 className=" ml-2 mt-[-22px] w-min rounded-md border-2 border-black bg-white px-2 text-lg">
          Buses
        </h2>
        <div className=" flex flex-row flex-wrap gap-1 pt-2">
          {stop.buses.map((bus) => (
            <div
              key={bus.id}
              className=" flex min-w-max flex-row gap-3 rounded-md border-2 p-2"
              style={{ borderColor: bus.color }}
            >
              <p>{bus.id}</p>
              <p>{bus.name}</p>
            </div>
          ))}
        </div>
      </div>
      <EditLocation
        location={{ lon: editedStop.longitude, lat: editedStop.latitude }}
        setLocation={(loc) => {
          setEditedStop((prev) => ({
            ...prev,
            longitude: loc.lon,
            latitude: loc.lat,
          }));
        }}
      />
      <div className=" mt-3 flex flex-row justify-end gap-3">
        <NavigateToStop stop={stop} edited={_.isEqual(editedStop, stop)} />
        <button
          className=" rounded-md bg-black p-3 px-6 font-bold text-white hover:bg-slate-800"
          onClick={async () => {
            const { dismiss } = toast({ title: "Saving..." });
            try {
              await save({
                id: editedStop.id,
                name: editedStop.name,
                description: editedStop.description,
                latitude: editedStop.latitude,
                longitude: editedStop.longitude,
              });
            } catch {
              toast({ title: "Error", variant: "destructive" });
              return;
            }
            dismiss();
            const { dismiss: dismiss2 } = toast({ title: "Saved!" });
            setTimeout(() => {
              dismiss2();
            }, 2000);
          }}
        >
          Save
        </button>
        <button
          disabled={stop.buses.length != 0}
          onClick={async () => await deleteStop({ id: editedStop.id })}
          className=" rounded-md bg-red-600 p-3 px-6 font-bold text-white hover:bg-red-400 disabled:bg-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function EditLocation({
  location,
  setLocation,
}: {
  location: { lat: number; lon: number } | undefined;
  setLocation: (loc: { lat: number; lon: number }) => void;
}) {
  return (
    <div className=" h-[403px] w-full overflow-clip rounded-md border-2 border-black">
      <Map
        defaultCenter={[RIT_CENTER.lat, RIT_CENTER.lng]}
        zoom={14}
        height={400}
        onClick={({ latLng }) =>
          setLocation({ lat: latLng[0], lon: latLng[1] })
        }
      >
        {location && location.lat != 0 && location.lon != 0 && (
          <Draggable
            anchor={[location.lat, location.lon]}
            offset={[12, 12]}
            onDragEnd={(anchor) => {
              setLocation({ lat: anchor[0], lon: anchor[1] });
            }}
          >
            <Image
              src="/icons/bus-192x192.png"
              alt="o"
              width={32}
              height={32}
            />
          </Draggable>
        )}
      </Map>
    </div>
  );
}

function NavigateToStop({
  stop,
  edited,
}: {
  stop: DetailedStop;
  edited: boolean;
}) {
  const { data: stops } = api.stops.getAll.useQuery();
  const [stopId, setStopId] = useState<number>(stop.id);
  const router = useRouter();
  const selectedStop = _.find(stops, { id: stopId });
  return (
    <div className=" relative flex flex-row justify-center rounded-md bg-black">
      <Select<{ value: number; label: string }>
        className=" w-48"
        options={stops?.map((stop) => ({
          value: stop.id,
          label: `${stop.id} ${stop.name}`,
        }))}
        value={{
          value: stopId,
          label: selectedStop
            ? `${selectedStop?.id} ${selectedStop?.name}`
            : "",
        }}
        onChange={(selection) => selection && setStopId(selection.value)}
        styles={selectStyles}
        placeholder="Select stops..."
      />
      <button
        className=" rounded-r-md bg-black p-2 px-4 text-white disabled:bg-slate-600"
        onClick={() => {
          if (
            edited &&
            !confirm("You have unsaved changes. Do you want to continue?")
          )
            return;
          router.push(`/manage/stop/${stopId}`);
        }}
        disabled={stopId == stop.id}
      >
        Go
      </button>
    </div>
  );
}
