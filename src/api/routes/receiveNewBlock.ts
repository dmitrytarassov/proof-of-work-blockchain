import { Block } from "../../types/Block";
import { Router } from "../../types/Router";

interface TransactionBroadcastEndpointBody {
  newBlock: Block;
}

export const receiveNewBlockUrl = "/receive-new-block";

export const receiveNewBlock: Router = (app, blockchain) => {
  app.post(receiveNewBlockUrl, async (req, res) => {
    const body = req.body as TransactionBroadcastEndpointBody;
    const { newBlock } = body;

    const result = blockchain.receiveNewBlock(newBlock);

    res.send({
      // block,
      note: result
        ? "New block was rejected"
        : "New block received successfully",
      newBlock,
    });
  });
};
