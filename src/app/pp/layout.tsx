import Header from "@/header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <Header title="Private Policy" />
      {props.children}
    </div>
  );
}
