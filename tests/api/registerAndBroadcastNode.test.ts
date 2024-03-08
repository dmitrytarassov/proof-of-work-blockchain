import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import { registerAndBroadcastNodeUrl } from "../../src/api/routes/registerAndBroadcastNode";
import { createBlockchainNodeAndApi } from "../utils/createBlockchainNodeAndApi";
import { getPort } from "../utils/getPort";
import { getRandomNumberInclusive } from "../utils/getRandomNumberInclusive";

describe("registerAndBroadcastNode", () => {
  const port = getPort();
  const { nodeUrl, blockchain, api } = createBlockchainNodeAndApi(port);
  const blockchain2 = createBlockchainNodeAndApi(getPort());

  it("should register and broadcast new node calling api", async () => {
    const data = { newNodeUrl: blockchain2.nodeUrl };
    await request(api).post(registerAndBroadcastNodeUrl).send(data);

    expect(blockchain.networkNodes.has(blockchain2.nodeUrl)).toBeTruthy();
    expect(blockchain2.blockchain.networkNodes.has(nodeUrl)).toBeTruthy();
  });
});
