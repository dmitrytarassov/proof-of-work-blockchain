import { beforeAll, describe, expect, it } from "@jest/globals";

import { createTransactionData } from "./utils/createTransactionData";
import { getRandomNumber } from "./utils/getRandomNumber";
import { getRandomString } from "./utils/getRandomString";

import { Blockchain } from "../src/blockchain";
import { CurrentBlockData } from "../src/types/CurrentBlockData";

describe("hash block", () => {
  let blockchain: Blockchain;

  beforeAll(() => {
    blockchain = new Blockchain();
  });

  it("hashing simple test", function () {
    const previousBlockHash = getRandomString();
    const nonce = getRandomNumber();

    const blockData: CurrentBlockData = {
      transactions: [
        createTransactionData(),
        createTransactionData(),
        createTransactionData(),
      ],
      index: getRandomNumber(),
    };

    const hash = blockchain.hashBlock(previousBlockHash, blockData, nonce);
    expect(typeof hash).toEqual("string");
    const hash2 = blockchain.hashBlock(previousBlockHash, blockData, nonce);
    expect(typeof hash2).toEqual("string");
    expect(hash2).toEqual(hash);

    const blockData2 = { ...blockData };
    blockData2.transactions.length = 1;
    const hash3 = blockchain.hashBlock(previousBlockHash, blockData2, nonce);
    expect(typeof hash3).toEqual("string");
    expect(hash3).not.toEqual(hash);
  });
});
