import { Express } from "express";

import { getRandomString } from "./getRandomString";

import { createApi } from "../../src/api/createApi";
import { Blockchain } from "../../src/blockchain";

export type CreatedBlockchain = {
  api: Express;
  blockchain: Blockchain;
  nodeUrl: string;
};

export function createBlockchainNodeAndApi(
  port: string | number
): CreatedBlockchain {
  const nodeUrl = `http://localhost:${port}`;
  const nodeAddress = getRandomString();
  const blockchain = new Blockchain(nodeAddress, nodeUrl);
  const api = createApi(port, nodeUrl, blockchain);

  return { api, blockchain, nodeUrl };
}
