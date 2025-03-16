import Header from "../_components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" w-full">
        <Header />
      </div>
      {children}
    </>
  );
}
