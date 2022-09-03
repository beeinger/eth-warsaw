import React from "react";
import { colors } from "shared/styles";

type Props = { onClick: () => void };

export default function PauseButton({ onClick }: Props) {
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
        fill={colors.red}
      />
      <path
        d="M18 25C18 20.0294 22.0294 16 27 16C31.9706 16 36 20.0294 36 25V56C36 60.9706 31.9706 65 27 65C22.0294 65 18 60.9706 18 56V25Z"
        fill={colors.lightOrange}
      />
      <path
        d="M46 25C46 20.0294 50.0294 16 55 16C59.9706 16 64 20.0294 64 25V56C64 60.9706 59.9706 65 55 65C50.0294 65 46 60.9706 46 56V25Z"
        fill={colors.lightOrange}
      />
    </svg>
  );
}
