import { ClientListOrganizer } from "@/test/listAnimator";

export default function Page() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <ClientListOrganizer specialKeys={["1", "3"]}>
        <p key={1} className=" w-32 border">
          Server Item 1
        </p>
        <p key={2} className=" w-32 border">
          Server Item 2
        </p>
        <p key={3} className=" w-32 border">
          Server Item 3
        </p>
      </ClientListOrganizer>
    </div>
  );
}
