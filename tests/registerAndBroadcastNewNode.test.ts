import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { SpiedFunction } from "jest-mock";

import { getRandomString } from "./utils/getRandomString";
import { postRequestData } from "./utils/postRequestData";

import { BlockchainNode } from "../src/BlockchainNode";
import { registerNodeUrl } from "../src/api/routes/registerNode";
import { registerNodesBulkUrl } from "../src/api/routes/registerNodesBulk";

export const assetsFetchMock = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
  } as Response);

describe("test registerAndBroadcastNewNode", () => {
  let fetchMock: SpiedFunction<{
    (
      input: URL | RequestInfo,
      init?: RequestInit | undefined
    ): Promise<Response>;
    (
      input: string | URL | Request,
      init?: RequestInit | undefined
    ): Promise<Response>;
  }>;

  const nodeAddress = getRandomString("http://");
  const node = new BlockchainNode(nodeAddress);

  const node2Address = getRandomString("http://");

  beforeAll(async () => {
    fetchMock = jest.spyOn(global, "fetch").mockImplementation(assetsFetchMock);
    await node.registerAndBroadcastNewNode(node2Address);
  });

  it("should add new node address and let network know about it", async function () {
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${node2Address}${registerNodeUrl}`,
      {
        ...postRequestData,
        body: JSON.stringify({ newNodeUrl: node2Address }),
      }
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${node2Address}${registerNodesBulkUrl}`,
      {
        ...postRequestData,
        body: JSON.stringify({
          allNetworkNodes: [node2Address, nodeAddress],
        }),
      }
    );
  });

  describe("add 3th node", function () {
    const node3Address = getRandomString("http://");

    beforeAll(async () => {
      await node.registerAndBroadcastNewNode(node3Address);
    });

    it("should add another node address and let network know about it", async function () {
      expect(fetchMock).toHaveBeenCalledTimes(5);

      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        `${node2Address}${registerNodeUrl}`,
        {
          body: JSON.stringify({ newNodeUrl: node3Address }),
          ...postRequestData,
        }
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        4,
        `${node3Address}${registerNodeUrl}`,
        {
          ...postRequestData,
          body: JSON.stringify({ newNodeUrl: node3Address }),
        }
      );

      expect(fetchMock).toHaveBeenNthCalledWith(
        5,
        `${node3Address}${registerNodesBulkUrl}`,
        {
          ...postRequestData,
          body: JSON.stringify({
            allNetworkNodes: [node2Address, node3Address, nodeAddress],
          }),
        }
      );
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
