import UserButton from "./_components/user-button";

export default function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <UserButton />
      </div>
      {/* <DateToDateTime /> */}
    </main>
  );
}
