import * as uuid from "uuid";

import { BlockchainNode } from "./BlockchainNode";
import {
  blockchainUrl,
  GetBlockchainApiResponse,
} from "./api/routes/blockchain";
import { receiveNewBlockUrl } from "./api/routes/receiveNewBlock";
import { transactionUrl } from "./api/routes/transaction";
import { Block } from "./types/Block";
import { CurrentBlockData } from "./types/CurrentBlockData";
import { Transaction } from "./types/Transaction";
import { chainIsValid } from "./utils/chainIsValid";
import {
  genesisBlockData,
  MINER_REWARD,
  MINER_REWARD_SENDER,
} from "./utils/constants";
import { hashBlock } from "./utils/hashBlock";
import { proofOfWork } from "./utils/proofOfWork";

export class Blockchain extends BlockchainNode {
  public chain: Block[] = [];
  public pendingTransactions: Transaction[] = [];

  constructor(public readonly nodeAddress: string = "", currentNodeUrl = "") {
    super(currentNodeUrl);
    this.createNewBlock(
      genesisBlockData.nonce,
      genesisBlockData.previousBlockHash,
      genesisBlockData.hash
    );
  }

  private createBlock(block: Block) {
    this.pendingTransactions = [];
    this.chain.push(block);
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

    this.createBlock(newBlock);

    return newBlock;
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async createNewTransactionAndBroadcast(
    amount: number,
    sender: string,
    recipient: string
  ): Promise<number> {
    const transaction = this.createNewTransaction(amount, sender, recipient);
    const block = this.addTransactionToPendingTransactions(transaction);

    await Blockchain.broadcast(this.networkNodes, transactionUrl, transaction);

    return block;
  }

  createNewTransaction(
    amount: number,
    sender: string,
    recipient: string
  ): Transaction {
    return {
      amount,
      sender,
      recipient,
      transactionId: uuid.v1().split("-").join(""),
    };
  }

  addTransactionToPendingTransactions(transaction: Transaction) {
    this.pendingTransactions.push(transaction);

    return this.getLastBlock().index + 1;
  }

  async mine(): Promise<Block> {
    const lastBlock = this.getLastBlock();
    const previousBlockHash = lastBlock.hash;

    const currentBlockData: CurrentBlockData = {
      transactions: this.pendingTransactions,
      index: lastBlock.index + 1,
    };

    const nonce = proofOfWork(previousBlockHash, currentBlockData);
    const hash = hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = this.createNewBlock(nonce, previousBlockHash, hash);

    await Blockchain.broadcast(this.networkNodes, receiveNewBlockUrl, {
      newBlock,
    });

    await this.createNewTransactionAndBroadcast(
      MINER_REWARD,
      MINER_REWARD_SENDER,
      this.nodeAddress
    );

    return newBlock;
  }

  receiveNewBlock(newBlock: Block): boolean {
    const lastBlock = this.getLastBlock();
    if (newBlock.previousBlockHash !== lastBlock.hash) {
      return false;
    }

    if (newBlock.index !== lastBlock.index + 1) {
      return false;
    }

    const currentBlockData: CurrentBlockData = {
      transactions: this.pendingTransactions,
      index: lastBlock.index + 1,
    };

    const hash = hashBlock(lastBlock.hash, currentBlockData, newBlock.nonce);

    if (hash !== newBlock.hash) {
      return false;
    }

    this.createBlock(newBlock);

    return true;
  }

  async consensus(): Promise<boolean> {
    const blockchains =
      await BlockchainNode.broadcast<GetBlockchainApiResponse>(
        this.networkNodes,
        blockchainUrl
      );

    let maxChainLength = this.chain.length;
    let newLongestChain: Block[] | null = null;
    let newPendingTransactions: Transaction[] = [];

    const blockchainsArray = [...blockchains.values()];

    blockchainsArray.forEach((blockchain) => {
      if (blockchain.blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.blockchain.chain.length;
        newLongestChain = blockchain.blockchain.chain;
        newPendingTransactions = blockchain.blockchain.pendingTransactions;
      }
    });

    if (newLongestChain && chainIsValid(newLongestChain)) {
      this.chain = newLongestChain;
      this.pendingTransactions = newPendingTransactions;

      return true;
    }

    return false;
  }
}
