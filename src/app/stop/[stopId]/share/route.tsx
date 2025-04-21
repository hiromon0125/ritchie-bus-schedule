/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { createURL, StopQRCode } from "./_qrcode";

export const runtime = "edge";

async function image(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string }> },
) {
  const { stopId } = await params;
  const logo = createURL(req, "/icons/bus-192x192.png", 100, 100);
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
        <div tw="flex flex-col items-center justify-center">
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
          />
          <div tw="flex flex-col ml-5">
            <h1 tw="text-3xl font-bold mb-0">Need a bus schedule?</h1>
            <p
              style={{
                fontSize: 30,
                marginTop: 5,
                marginBottom: 35,
              }}
            >
              Try Ritchie's Bus Schedule!
            </p>
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
