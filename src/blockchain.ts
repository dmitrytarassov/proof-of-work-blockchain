import sha256 from "sha256";

import { BlockchainNode } from "./BlockchainNode";
import { Block } from "./types/Block";
import { CurrentBlockData } from "./types/CurrentBlockData";
import { Transaction } from "./types/Transaction";
import { MINER_REWARD } from "./utils/constants";

export class Blockchain extends BlockchainNode {
  public chain: Block[] = [];
  public pendingTransactions: Transaction[] = [];

  constructor(private readonly nodeAddress: string = "", currentNodeUrl = "") {
    super(currentNodeUrl);
    this.createNewBlock(100, "0", "0");
  }

  createNewBlock(
    nonce: number,
    previousBlockHash: string,
    hash: string
  ): Block {
    const newBlock: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(
    amount: number,
    sender: string,
    recipient: string
  ): number {
    this.pendingTransactions.push({
      amount,
      sender,
      recipient,
    });

    return this.getLastBlock().index + 1;
  }

  hashBlock(
    previousBlockHash: string,
    currentBlockData: CurrentBlockData,
    nonce: number
  ): string {
    const dataString = [
      previousBlockHash,
      nonce,
      JSON.stringify(currentBlockData),
    ].join("");
    const hash = sha256(dataString);

    return hash;
  }

  proofOfWork(
    previousBlockHash: string,
    currentBlockData: CurrentBlockData
  ): number {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (!hash.startsWith("0000")) {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  mine(): Block {
    const lastBlock = this.getLastBlock();
    const previousBlockHash = lastBlock.hash;

    this.createNewTransaction(MINER_REWARD, "00", this.nodeAddress);

    const currentBlockData: CurrentBlockData = {
      transactions: this.pendingTransactions,
      index: lastBlock.index + 1,
    };

    const nonce = this.proofOfWork(previousBlockHash, currentBlockData);
    const hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = this.createNewBlock(nonce, previousBlockHash, hash);

    return newBlock;
  }
}
