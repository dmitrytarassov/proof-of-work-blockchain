import { beforeAll, describe, expect, it } from "@jest/globals";

import { createNewBlock } from "./utils/createNewBlock";
import { createTransactionData } from "./utils/createTransactionData";

import { Blockchain } from "../src/blockchain";
import { Transaction } from "../src/types/Transaction";

describe("crete new transaction", () => {
  let blockchain: Blockchain;

  beforeAll(() => {
    blockchain = new Blockchain();
  });

  it("create new transaction simple test", function () {
    createNewBlock(blockchain);

    const { sender, recipient, amount } = createTransactionData();

    blockchain.createNewTransaction(amount, sender, recipient);

    const { nonce, hash, previousBlockHash } = createNewBlock(blockchain);

    const lastProducedBlock = blockchain.getLastBlock();

    expect(lastProducedBlock.nonce).toEqual(nonce);
    expect(lastProducedBlock.hash).toEqual(hash);
    expect(lastProducedBlock.previousBlockHash).toEqual(previousBlockHash);
    expect(typeof lastProducedBlock.timestamp).toEqual("number");
    expect(lastProducedBlock.index).toEqual(blockchain.chain.length);

    expect(lastProducedBlock.transactions).toEqual([
      { amount, sender, recipient },
    ]);
  });

  it("create new transaction simple test - x tx in block", function () {
    createNewBlock(blockchain);

    const txs: Transaction[] = [];

    for (let i = 0; i < 10; i++) {
      const { sender, recipient, amount } = createTransactionData();
      blockchain.createNewTransaction(amount, sender, recipient);

      txs.push({ sender, recipient, amount });
    }

    expect(blockchain.pendingTransactions).toEqual(txs);

    const { nonce, hash, previousBlockHash } = createNewBlock(blockchain);
    const lastProducedBlock = blockchain.getLastBlock();

    expect(lastProducedBlock.nonce).toEqual(nonce);
    expect(lastProducedBlock.hash).toEqual(hash);
    expect(lastProducedBlock.previousBlockHash).toEqual(previousBlockHash);
    expect(typeof lastProducedBlock.timestamp).toEqual("number");
    expect(lastProducedBlock.index).toEqual(blockchain.chain.length);

    expect(lastProducedBlock.transactions).toEqual(txs);

    expect(blockchain.pendingTransactions).toEqual([]);
  });
});
