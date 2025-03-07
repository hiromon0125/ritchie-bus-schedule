import Header from "@/header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <Header title="Stop" />
      <div className=" m-auto flex w-full max-w-screen-lg flex-col gap-2 px-[--margin] py-2 xs:gap-4">
        {props.children}
      </div>
    </div>
  );
}
