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
  stateRoot: string;
  txnsHashes: string[];
};

export type Block = {
  number: string;
  id: string;
  timestamp: number;
  stateRoot: string;
  txnCount: number;
  msgCount: number;
  evCount: number;
  l1VerificationTxHash: string | null;
  status: string;
};

export type BlockWithTxns = Block & Payload;
