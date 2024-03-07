import { beforeAll, describe, expect, it } from "@jest/globals";

import { createTransactionData } from "./utils/createTransactionData";
import { getRandomNumber } from "./utils/getRandomNumber";
import { getRandomString } from "./utils/getRandomString";

import { Blockchain } from "../src/blockchain";
import { CurrentBlockData } from "../src/types/CurrentBlockData";

describe("proof of work", () => {
  let blockchain: Blockchain;

  beforeAll(() => {
    blockchain = new Blockchain();
  });

  it("getting nonce simple test", function () {
    const previousBlockHash = getRandomString();

    const blockData: CurrentBlockData = {
      transactions: [
        createTransactionData(),
        createTransactionData(),
        createTransactionData(),
      ],
      index: getRandomNumber(),
    };

    const nonce = blockchain.proofOfWork(previousBlockHash, blockData);

    expect(nonce).toBeGreaterThanOrEqual(0);

    const hash = blockchain.hashBlock(previousBlockHash, blockData, nonce);

    expect(hash.startsWith("0000")).toBeTruthy();
  });
});
