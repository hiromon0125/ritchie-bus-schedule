import { getServerBaseUrl } from "../../../../trpc/server";

/* eslint-disable @next/next/no-img-element */
export function StopQRCode({ stopId }: { stopId: string }) {
  const baseUrl = getServerBaseUrl();
  const url = new URL(`/stop/${stopId}`, baseUrl);
  return (
    <div
      style={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: 400,
          height: 400,
        }}
      >
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${url.toString()}?ref=qr`}
          alt={`QR code for stop ${stopId}`}
          width={400}
          height={400}
        />
        <img
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          src={`${baseUrl}/icons/bus-192x192.png`}
          alt="logo"
          height={100}
          width={100}
        />
      </div>
      <p
        style={{
          fontSize: 30,
        }}
      >
        {url.toString()}
      </p>
    </div>
  );
}
