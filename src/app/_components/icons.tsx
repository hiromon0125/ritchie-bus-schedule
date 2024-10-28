export function BusStopIcon({
  width = 24,
  height = 24,
  color,
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      style={{ color }}
      viewBox="0 0 300 300"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M158.743 20.2049C187.072 20.0665 214.613 27.9054 247.927 42.5895C253.586 45.084 257.481 50.739 257.481 57.2334V260.038C257.481 268.323 250.766 275.038 242.481 275.038C234.197 275.038 227.481 268.323 227.481 260.038V195.639H180.594V260.038C180.594 268.323 173.879 275.038 165.594 275.038C157.31 275.038 150.594 268.323 150.594 260.038V181.639C150.594 172.802 157.758 165.639 166.594 165.639H227.481V66.465C200.183 55.1221 179.228 50.1052 158.889 50.2046C136.476 50.3141 113.271 56.641 81.5784 70.3495C73.9749 73.6384 65.1449 70.1408 61.8561 62.5373C58.5672 54.9338 62.0649 46.1039 69.6683 42.815C102.933 28.4265 130.464 20.3431 158.743 20.2049ZM83.0374 120.774C91.3217 120.774 98.0374 127.49 98.0374 135.774V261.489C98.0374 269.773 91.3217 276.489 83.0374 276.489C74.7531 276.489 68.0374 269.773 68.0374 261.489V135.774C68.0374 127.49 74.7531 120.774 83.0374 120.774Z"
        fill="currentColor"
      />
      <circle cx="83.0374" cy="135.774" r="52.869" fill="currentColor" />
    </svg>
  );
}
