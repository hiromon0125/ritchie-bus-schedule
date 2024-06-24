import EditBusList from "@/editBusList";

async function Page() {
  return (
    <div className=" w-full max-w-screen-lg px-6">
      <h1>Bus List</h1>
      <EditBusList />
      <h1 className=" mt-10">Station List</h1>
    </div>
  );
}

export default Page;
