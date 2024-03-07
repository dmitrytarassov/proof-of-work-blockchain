import { beforeAll, describe, expect, it } from "@jest/globals";

import { createNewBlock } from "./utils/createNewBlock";

import { Blockchain } from "../src/blockchain";

describe("crete new block", () => {
  let blockchain: Blockchain;

  beforeAll(() => {
    blockchain = new Blockchain();
  });

  it("create new block simple test", function () {
    const { nonce, hash, previousBlockHash } = createNewBlock(blockchain);

    const lastProducedBlock = blockchain.getLastBlock();

    expect(lastProducedBlock.nonce).toEqual(nonce);
    expect(lastProducedBlock.hash).toEqual(hash);
    expect(lastProducedBlock.previousBlockHash).toEqual(previousBlockHash);
    expect(typeof lastProducedBlock.timestamp).toEqual("number");
    expect(lastProducedBlock.index).toEqual(blockchain.chain.length);
    expect(lastProducedBlock.transactions).toEqual([]);
  });
});
