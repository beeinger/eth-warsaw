import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import L2beat from "./L2beat.json";

export function useL2Beat() {
  return useContract({
    abi: L2beat as Abi,
    address:
      "0x02a1ae36c0821edf59a5b968e959922dcbdfb35e565fe05c721b60975e2bcf9e",
  });
}
