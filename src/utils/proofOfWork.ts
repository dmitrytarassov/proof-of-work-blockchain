import { hashBlock } from "./hashBlock";

import { CurrentBlockData } from "../types/CurrentBlockData";

export function proofOfWork(
  previousBlockHash: string,
  currentBlockData: CurrentBlockData
): number {
  let nonce = 0;
  let hash = hashBlock(previousBlockHash, currentBlockData, nonce);
  while (!hash.startsWith("0000")) {
    nonce++;
    hash = hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
}
