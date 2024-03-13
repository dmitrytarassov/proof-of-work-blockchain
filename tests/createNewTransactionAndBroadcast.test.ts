import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import { createNewBlock } from "./utils/createNewBlock";
import { createTransactionData } from "./utils/createTransactionData";
import { FetchMock, off, on } from "./utils/fetchMock";
import { getRandomString } from "./utils/getRandomString";
import { postRequestData } from "./utils/postRequestData";

import { registerNodeUrl } from "../src/api/routes/registerNode";
import { transactionUrl } from "../src/api/routes/transaction";
import { Blockchain } from "../src/blockchain";
import { Transaction } from "../src/types/Transaction";

describe("crete new transaction and broadcast", () => {
  let fetchMock: FetchMock;
  let blockchain: Blockchain;
  const blockchainNodes = [
    getRandomString("https://"),
    getRandomString("https://"),
  ];

  beforeAll(() => {
    fetchMock = on();
    blockchain = new Blockchain();
    blockchainNodes.forEach((node) => {
      blockchain.registerNewNode(node);
    });
  });

  it("create new transaction and broadcast simple test", function () {
    createNewBlock(blockchain);

    const { sender, recipient, amount } = createTransactionData();
    const block = blockchain.createNewTransactionAndBroadcast(
      amount,
      sender,
      recipient
    );
    const lastPendingTransaction =
      blockchain.pendingTransactions[blockchain.pendingTransactions.length - 1];

    expect(fetchMock).toHaveBeenCalledTimes(blockchainNodes.length);
    for (let i = 1; i <= blockchainNodes.length; i++) {
      expect(fetchMock).toHaveBeenNthCalledWith(
        i,
        `${blockchainNodes[i - 1]}${transactionUrl}`,
        {
          ...postRequestData,
          body: JSON.stringify({
            amount,
            sender,
            recipient,
            transactionId: lastPendingTransaction.transactionId,
          }),
        }
      );
    }
  });

  it("create new transaction simple test - x tx in block", function () {
    createNewBlock(blockchain);

    const txs: Transaction[] = [];

    for (let i = 0; i < 10; i++) {
      const { sender, recipient, amount } = createTransactionData();

      const transaction = blockchain.createNewTransaction(
        amount,
        sender,
        recipient
      );
      blockchain.addTransactionToPendingTransactions(transaction);

      txs.push(transaction);
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

  afterAll(() => {
    off();
  });
});
