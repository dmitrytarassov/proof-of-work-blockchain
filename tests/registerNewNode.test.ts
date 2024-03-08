import { describe, expect, it } from "@jest/globals";

import { getRandomString } from "./utils/getRandomString";

import { BlockchainNode } from "../src/BlockchainNode";

describe("test registerNewNode", () => {
  const nodeAddress = getRandomString();
  const node = new BlockchainNode(nodeAddress);

  it("should add new node address", () => {
    const newNodesAddresses = [
      getRandomString(),
      getRandomString(),
      getRandomString(),
    ];

    newNodesAddresses.forEach((address) => {
      node.registerNewNode(address);
    });

    for (const address of newNodesAddresses) {
      expect(node.networkNodes.has(address)).toBeTruthy();
    }
  });

  it("should not add the currentAddress address", () => {
    node.registerNewNode(nodeAddress);

    expect(node.networkNodes.has(nodeAddress)).toBeFalsy();
  });
});
