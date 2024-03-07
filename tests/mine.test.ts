import { beforeAll, describe, expect, it } from "@jest/globals";

import { getRandomNumber } from "./utils/getRandomNumber";
import { getRandomString } from "./utils/getRandomString";

import { Blockchain } from "../src/blockchain";
import { Transaction } from "../src/types/Transaction";
import { MINER_REWARD } from "../src/utils/constants";

const transactionsInBlock1: Transaction[] = [
  {
    amount: getRandomNumber(),
    sender: getRandomString(),
    recipient: getRandomString(),
  },
  {
    amount: getRandomNumber(),
    sender: getRandomString(),
    recipient: getRandomString(),
  },
];

describe("mine", () => {
  let blockchain: Blockchain;
  const nodeAddress = getRandomString();

  beforeAll(() => {
    // init blockchain
    blockchain = new Blockchain(nodeAddress);

    // add transactions
    for (const tx of transactionsInBlock1) {
      blockchain.createNewTransaction(tx.amount, tx.sender, tx.recipient);
    }
  });

  it("mine", function () {
    const lastBlock = blockchain.getLastBlock();

    expect(blockchain.pendingTransactions.length).toEqual(
      transactionsInBlock1.length
    );

    const block = blockchain.mine();

    expect(block.previousBlockHash).toEqual(lastBlock.hash);
    expect(block.transactions).toEqual([
      ...transactionsInBlock1,
      { sender: "00", recipient: nodeAddress, amount: MINER_REWARD },
    ]);
    expect(blockchain.pendingTransactions.length).toEqual(0);
  });
});
