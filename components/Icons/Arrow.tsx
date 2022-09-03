import React from "react";

export default function Arrow({
  direction = "up",
  onClick,
}: {
  direction: "up" | "down";
  onClick: () => void;
}) {
  return (
    <svg
      width="68"
      height="71"
      viewBox="0 0 68 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={`rotate(${direction === "up" ? 0 : 180})`}
      cursor="pointer"
      onClick={onClick}
    >
      <rect
        x="24.8592"
        y="21.9408"
        width="18"
        height="49"
        rx="9"
        fill="#F98466"
      />
      <path
        d="M27.1223 11.5759C30.2227 6.35764 37.7773 6.35762 40.8777 11.5759L56.2639 37.4727C59.4323 42.8055 55.5892 49.559 49.3863 49.559H18.6137C12.4108 49.559 8.56769 42.8055 11.736 37.4728L27.1223 11.5759Z"
        fill="#F98466"
      />
    </svg>
  );
}
