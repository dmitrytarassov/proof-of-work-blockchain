import { Blockchain } from "../../src/blockchain";
import { Block } from "../../src/types/Block";

export function createNewBlock(
  blockchain: Blockchain,
  nonce = Math.random(),
  previousBlockHash = Math.random().toString(),
  hash = Math.random().toString()
): { block: Block; nonce: number; previousBlockHash: string; hash: string } {
  const block: Block = blockchain.createNewBlock(
    nonce,
    previousBlockHash,
    hash
  );

  return { block, nonce, previousBlockHash, hash };
}
