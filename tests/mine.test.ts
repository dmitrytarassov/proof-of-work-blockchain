import { beforeAll, describe, expect, it } from "@jest/globals";

import { createTransactionData } from "./utils/createTransactionData";
import { getRandomString } from "./utils/getRandomString";
import { removeIdFromTransaction } from "./utils/removeIdFromTransaction";

import { Blockchain } from "../src/blockchain";
import { Transaction } from "../src/types/Transaction";
import { MINER_REWARD, MINER_REWARD_SENDER } from "../src/utils/constants";

const transactionsInBlock1: Transaction[] = [
  createTransactionData(),
  createTransactionData(),
];

describe("mine", () => {
  let blockchain: Blockchain;
  const nodeAddress = getRandomString();

  beforeAll(() => {
    // init blockchain
    blockchain = new Blockchain(nodeAddress);

    // add transactions
    for (const tx of transactionsInBlock1) {
      const transaction = blockchain.createNewTransaction(
        tx.amount,
        tx.sender,
        tx.recipient
      );
      blockchain.addTransactionToPendingTransactions(transaction);
    }
  });

  it("mine", async function () {
    const lastBlock = blockchain.getLastBlock();

    expect(blockchain.pendingTransactions.length).toEqual(
      transactionsInBlock1.length
    );

    const block = await blockchain.mine();

    expect(block.previousBlockHash).toEqual(lastBlock.hash);
    expect(block.transactions.map(removeIdFromTransaction)).toEqual([
      ...transactionsInBlock1,
    ]);
    expect(blockchain.pendingTransactions.length).toEqual(1);
    expect(blockchain.pendingTransactions.map(removeIdFromTransaction)).toEqual(
      [
        {
          sender: MINER_REWARD_SENDER,
          recipient: nodeAddress,
          amount: MINER_REWARD,
          transactionId: "",
        },
      ]
    );
  });
});
