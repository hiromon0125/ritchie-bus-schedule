/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { StopQRCode } from "./_qrcode";

async function image(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string }> },
) {
  const { protocol, host } = new URL(req.url);
  const baseUrl = `${protocol}//${host}`;
  const { stopId } = await params;
  const logo = `${baseUrl}/icons/bus-192x192.png`;
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#000",
        }}
      >
        <div tw="flex flex-row items-center justify-center mb-10">
          <img
            src={logo}
            alt="logo"
            width={80}
            height={80}
            style={{
              height: 80,
              width: 80,
              objectFit: "cover",
              objectPosition: "center",
            }}
            itemType="image/png"
          />
          <div tw="flex flex-col ml-5">
            <h1 tw="text-4xl font-bold mb-0 mt-0">Need a bus schedule?</h1>
            <p tw="text-3xl font-bold mb-0 mt-0">Try Ritchie's Bus Schedule!</p>
          </div>
        </div>
        <StopQRCode req={req} stopId={stopId} />
      </div>
    ),
    {
      width: 630,
      height: 850,
    },
  );
}

export { image as GET };
