/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getServerBaseUrl } from "../../../../trpc/server";
import { StopQRCode } from "./_qrcode";

async function image(
  req: Request,
  { params }: { params: Promise<{ stopId: string }> },
) {
  const { stopId } = await params;
  const baseUrl = getServerBaseUrl();
  const logo = new URL("/icons/bus-192x192.png", baseUrl).toString();
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="logo" width={100} height={100} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 20,
            }}
          >
            <h1
              style={{
                fontSize: 35,
                marginBottom: 0,
              }}
            >
              Need a bus schedule?
            </h1>
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
        <StopQRCode stopId={stopId} />
      </div>
    ),
    {
      width: 630,
      height: 800,
    },
  );
}

export { image as GET };
