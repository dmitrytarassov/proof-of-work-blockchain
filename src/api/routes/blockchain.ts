import { Blockchain } from "../../blockchain";
import { Router } from "../../types/Router";

export const blockchainUrl = "/blockchain";

export type GetBlockchainApiResponse = {
  blockchain: Blockchain;
  networkNodes: string[];
};

export const blockchain: Router = (app, blockchain) => {
  app.get(blockchainUrl, (req, res) => {
    const response: GetBlockchainApiResponse = {
      blockchain,
      networkNodes: blockchain._networkNodes,
    };

    res.json(response);
  });
};
