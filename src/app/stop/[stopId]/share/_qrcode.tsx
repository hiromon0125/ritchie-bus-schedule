import type { NextRequest } from "next/server";

/* eslint-disable @next/next/no-img-element */
export function StopQRCode({
  req,
  stopId,
}: {
  req: NextRequest;
  stopId: string;
}) {
  const { protocol, host } = new URL(req.url);
  const baseUrl = `${protocol}//${host}`;
  const url = new URL(`/stop/${stopId}`, baseUrl).toString();
  return (
    <div
      style={{
        width: 550,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${url}?ref=qr`}
        alt={`QR code for stop ${stopId}`}
        width={550}
        height={550}
      />
      <p
        style={{
          fontSize: 30,
        }}
      >
        {url}
      </p>
    </div>
  );
}
