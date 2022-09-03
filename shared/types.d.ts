export interface Transaction {
  blockId: string;
  hash: string;
  index: number;
  l1VerificationHash: string | null;
  type: "invoke" | "deploy";
  to: string;
  /**
   * In seconds (unix)
   */
  timestamp: number;
  actual_fee: string | null;
  status: string;
}

export type Payload = {
  blockId: string;
  txnsHashes: string[];
};
