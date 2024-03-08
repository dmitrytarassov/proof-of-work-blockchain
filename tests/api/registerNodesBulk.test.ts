import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import { registerNodesBulkUrl } from "../../src/api/routes/registerNodesBulk";
import { createBlockchainNodeAndApi } from "../utils/createBlockchainNodeAndApi";
import { getPort } from "../utils/getPort";
import { getRandomString } from "../utils/getRandomString";

describe("registerNodesBulk", () => {
  const port = getPort();
  const { nodeUrl, blockchain, api } = createBlockchainNodeAndApi(port);

  it("should register new node calling api", async () => {
    const newNodes = [
      getRandomString("https://"),
      getRandomString("https://"),
      nodeUrl,
    ];
    const data = { allNetworkNodes: newNodes };
    await request(api).post(registerNodesBulkUrl).send(data);

    expect(blockchain.networkNodes.has(newNodes[0])).toBeTruthy();
    expect(blockchain.networkNodes.has(newNodes[1])).toBeTruthy();
    expect(blockchain.networkNodes.has(nodeUrl)).toBeFalsy();
  });
});
