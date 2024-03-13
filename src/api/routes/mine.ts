import { Router } from "../../types/Router";

export const mineUrl = "/mine";

export const mine: Router = (app, blockchain) => {
  app.get(mineUrl, async (req, res) => {
    const newBlock = await blockchain.mine();

    res.json({
      note: "New block mined & broadcast successfully",
      block: newBlock,
    });
  });
};
