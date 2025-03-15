import Header from "../_components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" w-full bg-slate-900">
        <Header title="About" />
      </div>
      {children}
    </>
  );
}
