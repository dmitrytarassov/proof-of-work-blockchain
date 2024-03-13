import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import { blockchainUrl } from "../../src/api/routes/blockchain";
import { registerAndBroadcastNodeUrl } from "../../src/api/routes/registerAndBroadcastNode";
import { createBlockchainNodeAndApi } from "../utils/createBlockchainNodeAndApi";
import { getPort } from "../utils/getPort";

describe("registerAndBroadcastNode", () => {
  const port = getPort();
  const { nodeUrl, blockchain, api } = createBlockchainNodeAndApi(port);
  const blockchain2 = createBlockchainNodeAndApi(getPort());

  it("should register and broadcast new node calling api", async () => {
    const data = { newNodeUrl: blockchain2.nodeUrl };
    await request(api).post(registerAndBroadcastNodeUrl).send(data);

    expect(blockchain.networkNodes.has(blockchain2.nodeUrl)).toBeTruthy();
    expect(blockchain2.blockchain.networkNodes.has(nodeUrl)).toBeTruthy();

    const api1response = await request(api).get(blockchainUrl);
    expect(
      api1response.body.networkNodes.includes(blockchain2.nodeUrl)
    ).toBeTruthy();

    const api2response = await request(blockchain2.api).get(blockchainUrl);
    expect(api2response.body.networkNodes.includes(nodeUrl)).toBeTruthy();
  });
});
