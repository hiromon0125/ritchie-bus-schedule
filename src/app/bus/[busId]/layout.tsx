import Header from "@/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" [--margin:8px] md:[--margin:24px]">
      <Header title="Bus" route="bus" />
      {children}
    </main>
  );
}
