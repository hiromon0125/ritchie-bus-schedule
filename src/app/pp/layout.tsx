import Header from "@/header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <Header title="Privacy Policy" />
      {props.children}
    </div>
  );
}
