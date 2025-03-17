"use client";
import _ from "lodash";
import { Map, Marker, ZoomControl } from "pigeon-maps";

export default function DotMap({
  markers,
}: {
  markers: { lat: number; lng: number; tag: string | number; name: string }[];
}) {
  const center = {
    lat:
      ((_.minBy(markers, "lat")?.lat ?? markers[0]?.lat ?? 0) +
        (_.maxBy(markers, "lat")?.lat ?? markers[0]?.lat ?? 0)) /
      2,
    lng:
      ((_.minBy(markers, "lng")?.lng ?? markers[0]?.lng ?? 0) +
        (_.maxBy(markers, "lng")?.lng ?? markers[0]?.lng ?? 0)) /
      2,
  };
  return (
    <Map
      center={[center.lat, center.lng]}
      minZoom={13}
      maxZoom={16}
      metaWheelZoom
      metaWheelZoomWarning="Use META + scroll to zoom the map"
      twoFingerDrag
      twoFingerDragWarning="Use two fingers to move the map"
    >
      <ZoomControl style={{ bottom: 12, left: 12, top: undefined }} />
      {markers.map((marker, i) => (
        <Marker anchor={[marker.lat, marker.lng]} offset={[-7, -7]} key={i}>
          <div
            className=" bg-item-background flex aspect-square w-7 flex-col items-center justify-center rounded-full border-2 border-[--color] p-[2px] text-center [--color:var(--bus-color,black)]"
            title={marker.name}
          >
            <p>{marker.tag}</p>
          </div>
        </Marker>
      ))}
    </Map>
  );
}
