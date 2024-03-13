import { Blockchain } from "../../blockchain";
import { Block } from "../../types/Block";
import { Router } from "../../types/Router";

export const getConsensusApiUrl = "/consensus";

export const getConsensusResultNotes = {
  replaced: "This chain has been replaced",
  notReplaced: "Current chain has not be replaced",
};

export type GetConsensusApiResponse = {
  note: string;
  chain: Block[];
};

export const consensus: Router = (app, blockchain) => {
  app.get(getConsensusApiUrl, async (req, res) => {
    const result = await blockchain.consensus();

    const response: GetConsensusApiResponse = {
      chain: blockchain.chain,
      note: result
        ? getConsensusResultNotes.replaced
        : getConsensusResultNotes.notReplaced,
    };

    res.json(response);
  });
};
