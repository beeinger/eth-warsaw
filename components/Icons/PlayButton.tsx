import React from "react";

type Props = { onClick: () => void };

export default function PlayButton({ onClick }: Props) {
  return (
    <svg
      width="81"
      height="81"
      viewBox="0 0 81 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      cursor="pointer"
    >
      <path
        d="M81 40.5001C81 62.8676 62.8675 81.0001 40.5 81.0001C18.1325 81.0001 0 62.8676 0 40.5001C0 18.1326 18.1325 9.15527e-05 40.5 9.15527e-05C62.8675 9.15527e-05 81 18.1326 81 40.5001Z"
        fill="#F6643C"
      />
      <path
        d="M60.5028 34.1223C65.7211 37.2227 65.7211 44.7773 60.5028 47.8777L34.606 63.2639C29.2733 66.4323 22.5197 62.5892 22.5197 56.3863L22.5197 25.6137C22.5197 19.4108 29.2732 15.5677 34.6059 18.736L60.5028 34.1223Z"
        fill="white"
      />
    </svg>
  );
}
