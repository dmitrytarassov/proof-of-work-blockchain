import { beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { blockchain } from "../../src/api/routes/blockchain";
import { mineUrl } from "../../src/api/routes/mine";
import { transactionUrlBroadcast } from "../../src/api/routes/transactionBroadcast";
import { Block } from "../../src/types/Block";
import { MINER_REWARD, MINER_REWARD_SENDER } from "../../src/utils/constants";
import {
  createBlockchainNodeAndApi,
  CreatedBlockchain,
} from "../utils/createBlockchainNodeAndApi";
import { createTransactionData } from "../utils/createTransactionData";
import { getPort } from "../utils/getPort";
import { getRandomNumberInclusive } from "../utils/getRandomNumberInclusive";
import { removeIdFromTransaction } from "../utils/removeIdFromTransaction";

describe("receiveNewBlock.", () => {
  const blockchainCount = 5;
  const transactionsInBlock1Count = 10;
  const blockchains: CreatedBlockchain[] = [...Array(blockchainCount)].map(() =>
    createBlockchainNodeAndApi(getPort())
  );

  beforeAll(async () => {
    // create blockchains
    for (let i = 1; i < blockchainCount; i++) {
      await blockchains[0].blockchain.registerAndBroadcastNewNode(
        blockchains[i].nodeUrl
      );
    }

    // send transaction to random node
    for (let j = 0; j < transactionsInBlock1Count; j++) {
      const transaction = createTransactionData();
      await request(
        blockchains[getRandomNumberInclusive(0, blockchainCount - 1)].api
      )
        .post(transactionUrlBroadcast)
        .send(transaction);
    }
  });
  // const { nodeUrl, blockchain, api } = createBlockchainNodeAndApi(port);

  it("check the sates equality", async () => {
    expect(blockchains[0].blockchain.pendingTransactions.length).toEqual(
      transactionsInBlock1Count
    );
    for (let i = 1; i < blockchainCount; i++) {
      expect(blockchains[0].blockchain.pendingTransactions).toEqual(
        blockchains[i].blockchain.pendingTransactions
      );
    }
  });

  describe("mine new block", () => {
    const minerIndex = getRandomNumberInclusive(0, blockchainCount - 1);
    const lastProducedBlock =
      blockchains[minerIndex].blockchain.getLastBlock().index;

    beforeAll(async () => {
      await request(blockchains[minerIndex].api).get(mineUrl).send();
    });

    it("check that block was mined", () => {
      for (const blockchain of blockchains) {
        expect(blockchain.blockchain.getLastBlock().index).toEqual(
          lastProducedBlock + 1
        );
      }
    });

    it("check that each blockchain has the only pending transaction - MINER REWARD", () => {
      for (const blockchain of blockchains) {
        expect(blockchain.blockchain.pendingTransactions.length).toEqual(1);
        expect(
          removeIdFromTransaction(blockchain.blockchain.pendingTransactions[0])
        ).toEqual({
          sender: MINER_REWARD_SENDER,
          recipient: blockchains[minerIndex].blockchain.nodeAddress,
          amount: MINER_REWARD,
          transactionId: "",
        });
      }
    });
  });
});
