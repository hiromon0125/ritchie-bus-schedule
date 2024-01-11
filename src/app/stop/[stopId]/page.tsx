function Page({ params }: { params: { stopId: string } }) {
  const stopId = parseInt(params.stopId);
  return <div>{stopId}</div>;
}

export default Page;
