import { genesisBlockData } from "./constants";
import { hashBlock } from "./hashBlock";

import { Block } from "../types/Block";

export function chainIsValid(_blocks: Block[]): boolean {
  // add pre-genesis Block
  const blocks: Block[] = [
    {
      previousBlockHash: "",
      hash: genesisBlockData.previousBlockHash,
      nonce: 0,
      transactions: [],
      index: 0,
      timestamp: 0,
    },
    ..._blocks,
  ];

  for (let i = blocks.length - 1; i > 0; i--) {
    const block = blocks[i];
    const previousBlock = blocks[i - 1];

    if (block.previousBlockHash !== previousBlock.hash) {
      return false;
    }

    if (i !== 1) {
      const hash = hashBlock(
        previousBlock.hash,
        {
          transactions: block.transactions,
          index: block.index,
        },
        block.nonce
      );

      if (!hash.startsWith("0000")) {
        return false;
      }

      if (hash !== block.hash) {
        return false;
      }
    } else {
      if (block.hash !== genesisBlockData.hash) {
        return false;
      }
      if (block.nonce !== genesisBlockData.nonce) {
        return false;
      }
      if (block.previousBlockHash !== genesisBlockData.previousBlockHash) {
        return false;
      }
      if (block.transactions.length > 0) {
        return false;
      }
    }
  }

  return true;
}
