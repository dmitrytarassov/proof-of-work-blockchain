import { beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { transactionUrlBroadcast } from "../../src/api/routes/transactionBroadcast";
import { createBlockchainNodeAndApi } from "../utils/createBlockchainNodeAndApi";
import { createTransactionData } from "../utils/createTransactionData";
import { getPort } from "../utils/getPort";

describe("createTransactionAndBroadcast.test.ts", () => {
  const blockchain1 = createBlockchainNodeAndApi(getPort());
  const blockchain2 = createBlockchainNodeAndApi(getPort());
  const blockchain3 = createBlockchainNodeAndApi(getPort());

  beforeAll(() => {
    blockchain1.blockchain.registerAndBroadcastNewNode(blockchain2.nodeUrl);
    blockchain1.blockchain.registerAndBroadcastNewNode(blockchain3.nodeUrl);
  });
  // const { nodeUrl, blockchain, api } = createBlockchainNodeAndApi(port);

  it("should broadcast transaction to all nodes calling api", async () => {
    const transaction = createTransactionData();
    const response = await request(blockchain1.api)
      .post(transactionUrlBroadcast)
      .send(transaction);

    const lastPendingTransaction =
      blockchain1.blockchain.pendingTransactions[
        blockchain1.blockchain.pendingTransactions.length - 1
      ];

    expect(response.body.block).toEqual(
      blockchain1.blockchain.getLastBlock().index + 1
    );

    expect(lastPendingTransaction.sender).toEqual(transaction.sender);
    expect(lastPendingTransaction.amount).toEqual(transaction.amount);
    expect(lastPendingTransaction.recipient).toEqual(transaction.recipient);

    expect(blockchain1.blockchain.pendingTransactions).toEqual(
      blockchain2.blockchain.pendingTransactions
    );
    expect(blockchain1.blockchain.pendingTransactions).toEqual(
      blockchain3.blockchain.pendingTransactions
    );
  });
});
