import { beforeAll, describe, expect, it } from "@jest/globals";

import { createTransactionData } from "./utils/createTransactionData";
import { getRandomString } from "./utils/getRandomString";
import { removeIdFromTransaction } from "./utils/removeIdFromTransaction";

import { Blockchain } from "../src/blockchain";
import { Block } from "../src/types/Block";
import { Transaction } from "../src/types/Transaction";
import { MINER_REWARD, MINER_REWARD_SENDER } from "../src/utils/constants";

const transactionsInBlock1: Transaction[] = [
  createTransactionData(),
  createTransactionData(),
];

describe("receiveNewBlock", () => {
  const blockchain = new Blockchain(getRandomString());
  const blockchain2 = new Blockchain(getRandomString());

  beforeAll(() => {
    // add transactions
    for (const tx of transactionsInBlock1) {
      const transaction = blockchain.createNewTransaction(
        tx.amount,
        tx.sender,
        tx.recipient
      );
      blockchain.addTransactionToPendingTransactions(transaction);
      blockchain2.addTransactionToPendingTransactions(transaction);
    }
  });

  it("check state equality", async function () {
    expect(blockchain.pendingTransactions).toEqual(
      blockchain2.pendingTransactions
    );
    expect(blockchain.getLastBlock()).toEqual(blockchain2.getLastBlock());
  });

  describe("mine new block", () => {
    let block: Block;

    beforeAll(async () => {
      block = await blockchain.mine();
    });

    // blockchain 1 mined new block
    it("check state inequality", () => {
      expect(blockchain.pendingTransactions).not.toEqual(
        blockchain2.pendingTransactions
      );
      expect(blockchain.getLastBlock()).not.toEqual(blockchain2.getLastBlock());
      expect(blockchain.pendingTransactions.length).toEqual(1);
      expect(
        removeIdFromTransaction(blockchain.pendingTransactions[0])
      ).toEqual({
        sender: MINER_REWARD_SENDER,
        recipient: blockchain.nodeAddress,
        amount: MINER_REWARD,
        transactionId: "",
      });
    });

    describe("receiveNewBlock", () => {
      beforeAll(() => {
        blockchain2.receiveNewBlock(block);
      });

      it("check state equality", async function () {
        expect(blockchain.getLastBlock()).toEqual(blockchain2.getLastBlock());
      });

      it("check that new node does not know about MINER_REWARD transaction", () => {
        // blockchains are not connected via api
        expect(blockchain.pendingTransactions).not.toEqual(
          blockchain2.pendingTransactions
        );
      });
    });
  });
});
