const paths = {
  more: "M5 12h.01M12 12h.01M19 12h.01",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  chevron: "m9 5 7 7-7 7",
  search: "m21 21-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0",
  book: "M12 5v16m0-16C8 2 4 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-2-1-6-2-10 1",
  home: "m3 10 9-7 9 7v11h-6v-7H9v7H3V10",
  monitor: "M3 3h18v14H3zM8 21h8m-4-4v4",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  check: "m5 12 4 4L19 6",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3",
  clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  chart: "M3 3v18h18M7 14l4-4 4 2 6-7",
  message:
    "M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9ZM7 8h10M7 12h6",
  user: "M20 21v-2a7 7 0 0 0-14 0v2M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  users:
    "M16 21v-2a6 6 0 0 0-12 0v2M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M18 4a4 4 0 0 1 0 8m1 3a5 5 0 0 1 3 5v1",
  calendar: "M4 5h16v16H4zM8 3v4m8-4v4M4 11h16m-11 4h2m2 0h2",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 6 5 12 0 18-5-6-5-12 0-18",
  cap: "m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5m4-3v8",
  mail: "M3 5h18v14H3zM3 5l9 8 9-8",
  leaf: "M20 3C9 2 3 7 4 14c1 7 14 6 16-11ZM3 21 15 9",
};
export default function Icon({ name, size = 20, className = "", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={paths[name] || paths.book} />
    </svg>
  );
}
