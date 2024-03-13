import { beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { getConsensusApiUrl } from "../../src/api/routes/consensus";
import { mineUrl } from "../../src/api/routes/mine";
import { registerAndBroadcastNodeUrl } from "../../src/api/routes/registerAndBroadcastNode";
import { transactionUrlBroadcast } from "../../src/api/routes/transactionBroadcast";
import {
  createBlockchainNodeAndApi,
  CreatedBlockchain,
} from "../utils/createBlockchainNodeAndApi";
import { createTransactionData } from "../utils/createTransactionData";
import { getPort } from "../utils/getPort";
import { getRandomNumberInclusive } from "../utils/getRandomNumberInclusive";
import { removeTimestamp } from "../utils/removeTimestamp";
import { sortString } from "../utils/sortString";

describe("consensus", () => {
  const blockchainCount = 5;
  const blockCount = 5;
  const transactionsInBlock1Count = 2;
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

    for (let i = 0; i < blockCount; i++) {
      // send transaction to random node
      for (let j = 0; j < transactionsInBlock1Count; j++) {
        const transaction = createTransactionData();
        await request(
          blockchains[getRandomNumberInclusive(0, blockchainCount - 1)].api
        )
          .post(transactionUrlBroadcast)
          .send(transaction);
      }

      const minerId = getRandomNumberInclusive(0, blockchainCount - 1);

      await request(blockchains[minerId].api).get(mineUrl).send();
    }
  });

  it("should each chain has the same state", async () => {
    const chain = blockchains[0].blockchain.chain;
    const pendingTransactions = blockchains[0].blockchain.pendingTransactions;

    expect(chain.length).toEqual(blockCount + 1);
    expect(pendingTransactions.length).toEqual(1);

    for (let i = 1; i < blockchainCount; i++) {
      expect(blockchains[i].blockchain.chain.map(removeTimestamp)).toEqual(
        chain.map(removeTimestamp)
      );

      expect(blockchains[i].blockchain.pendingTransactions).toEqual(
        pendingTransactions
      );
    }
  });

  describe("create new node", () => {
    const blockchain = createBlockchainNodeAndApi(getPort());

    it("should new node not know about other nodes", () => {
      expect(
        blockchains[
          getRandomNumberInclusive(0, blockchainCount - 1)
        ].blockchain.networkNodes.has(blockchain.nodeUrl)
      ).toBeFalsy();
    });

    describe("broadcast new node", () => {
      beforeAll(async () => {
        await request(
          blockchains[getRandomNumberInclusive(0, blockchainCount - 1)].api
        )
          .post(registerAndBroadcastNodeUrl)
          .send({ newNodeUrl: blockchain.nodeUrl });
      });

      it("should new node know about other nodes", () => {
        expect(
          blockchains[
            getRandomNumberInclusive(0, blockchainCount - 1)
          ].blockchain.networkNodes.has(blockchain.nodeUrl)
        ).toBeTruthy();

        expect(blockchain.blockchain._networkNodes.sort(sortString)).toEqual(
          blockchains.map((e) => e.nodeUrl).sort(sortString)
        );
      });

      it("should new node state be wrong", () => {
        const chain = blockchains[0].blockchain.chain;

        expect(chain.length).not.toEqual(blockchain.blockchain.chain.length);
      });

      describe("call consensus method", () => {
        beforeAll(async () => {
          await request(blockchain.api).get(getConsensusApiUrl).send();
        });

        it("should new node state be correct", () => {
          const chain = blockchains[0].blockchain.chain;
          const pendingTransactions =
            blockchains[0].blockchain.pendingTransactions;

          expect(blockchain.blockchain.chain.map(removeTimestamp)).toEqual(
            chain.map(removeTimestamp)
          );

          expect(blockchain.blockchain.pendingTransactions).toEqual(
            pendingTransactions
          );
        });
      });
    });
  });
});
