import Coffee from "@/buymecoffee";

function Footer() {
  return (
    <div className=" min-h-60 w-full bg-slate-800">
      <div className=" m-auto flex min-h-60 w-full max-w-screen-lg flex-col justify-between pb-16 sm:flex-row sm:gap-0 sm:pb-0">
        <div className=" flex flex-col gap-4 p-4">
          <h2 className=" text-3xl text-slate-200">Ritchie Bus Schedule</h2>
          <p className=" text-slate-200">
            This is a project made by{" "}
            <a
              className=" text-slate-200 underline"
              href="https://github.com/hiromon0125"
            >
              {" "}
              Hiroto Takeuchi
            </a>{" "}
            and{" "}
            <a
              className=" text-slate-200 underline"
              href="https://github.com/0SMA0"
            >
              Sam Ruan
            </a>
            .<br />
            <br />
          </p>
          <Coffee />
        </div>
        <div className=" flex-1 sm:pl-16">
          <div className=" flex flex-col gap-4 p-4">
            <h2 className=" text-3xl text-slate-200">Links</h2>
            <div className=" flex flex-row gap-4">
              <a className=" text-slate-200 underline" href="/">
                Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
