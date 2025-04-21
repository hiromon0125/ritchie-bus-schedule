import type { NextRequest } from "next/server";

export function createURL(
  req: NextRequest,
  filePath: string,
  w: number,
  h: number,
  q = 75,
) {
  const { protocol, host } = new URL(req.url);

  const url = new URL(`${protocol}//${host}/_next/image`);
  url.searchParams.set("url", encodeURIComponent(filePath));
  url.searchParams.set("w", w.toString());
  url.searchParams.set("h", h.toString());
  url.searchParams.set("q", q.toString());
  url.searchParams.set("type", "png");
  return url.toString();
}

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
