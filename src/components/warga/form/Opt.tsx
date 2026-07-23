"use client";

export default function Opt({
  items,
}: {
  items: string[];
}) {
  return (
    <>
      <option value="">
        — Pilih —
      </option>

      {items.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </>
  );
}