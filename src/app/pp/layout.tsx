import Header from "@/header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
}
