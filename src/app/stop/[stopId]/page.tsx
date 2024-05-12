import Header from "@/header";
import Link from "next/link";

function Page({ params }: { params: { stopId: string } }) {
  const stopId = parseInt(params.stopId);
  return (
    <div className=" flex min-h-screen flex-col items-center">
      <Header />
      <div>
        <h1>Stop {stopId}</h1>
        <p>This is the stop page.</p>
        <p>Coming soon!</p>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}

export default Page;
