import { ImageResponse } from "next/og";
import { StopQRCode } from "./_qrcode";

async function image(
  req: Request,
  { params }: { params: Promise<{ stopId: string }> },
) {
  const { stopId } = await params;
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
          }}
        >
          Try Ritchie's Bus Schedule!
        </p>
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
