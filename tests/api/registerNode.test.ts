import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import { registerNodeUrl } from "../../src/api/routes/registerNode";
import { createBlockchainNodeAndApi } from "../utils/createBlockchainNodeAndApi";
import { getPort } from "../utils/getPort";
import { getRandomNumberInclusive } from "../utils/getRandomNumberInclusive";

describe("registerNode", () => {
  const port = getPort();
  const { nodeUrl, blockchain, api } = createBlockchainNodeAndApi(port);
  const blockchain2 = createBlockchainNodeAndApi(getPort());

  it("should register new node calling api", async () => {
    const data = { newNodeUrl: blockchain2.nodeUrl };
    await request(api).post(registerNodeUrl).send(data);

    expect(blockchain.networkNodes.has(blockchain2.nodeUrl)).toBeTruthy();
    expect(blockchain2.blockchain.networkNodes.has(nodeUrl)).toBeFalsy();
  });

  it("should not register the same node", async () => {
    const data = { newNodeUrl: nodeUrl };
    await request(api).post(registerNodeUrl).send(data);

    expect(blockchain.networkNodes.has(nodeUrl)).toBeFalsy();
  });
});
