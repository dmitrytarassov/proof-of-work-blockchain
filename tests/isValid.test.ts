import { beforeAll, describe, expect, it } from "@jest/globals";

import { createTransactionData } from "./utils/createTransactionData";
import { getRandomNumberInclusive } from "./utils/getRandomNumberInclusive";
import { getRandomString } from "./utils/getRandomString";

import { Blockchain } from "../src/blockchain";
import { Transaction } from "../src/types/Transaction";
import { chainIsValid } from "../src/utils/chainIsValid";

describe("check blockchain is valid", () => {
  const blocksCount = 10;
  const blockchain = new Blockchain(getRandomString("https://"));
  const transactionsInBlock: Map<number, Transaction[]> = new Map();

  beforeAll(async () => {
    for (let i = 0; i < blocksCount; i++) {
      const transactions: Transaction[] = [
        ...Array(getRandomNumberInclusive(4, 10)),
      ].map(() => {
        const tx = createTransactionData();
        const txWithId = blockchain.createNewTransaction(
          tx.amount,
          tx.sender,
          tx.recipient
        );
        blockchain.addTransactionToPendingTransactions(txWithId);

        return txWithId;
      });

      transactionsInBlock.set(i, transactions);
      await blockchain.mine();
    }
  });

  it("should blockchain to be valid", () => {
    expect(blockchain.getLastBlock().index).toEqual(
      blocksCount + 1 /*genesis block*/
    );

    expect(chainIsValid(blockchain.chain)).toBeTruthy();
  });
});
