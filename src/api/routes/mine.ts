import { Router } from "../../types/Router";

export const mine: Router = (app, blockchain) => {
  app.get("/mine", (req, res) => {
    const newBlock = blockchain.mine();

    res.json({
      note: "New block mined successfully",
      block: newBlock,
    });
  });
};
