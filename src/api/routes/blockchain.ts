import { Router } from "../../types/Router";

export const blockchain: Router = (app, blockchain) => {
  app.get("/blockchain", (req, res) => {
    res.json({ blockchain });
  });
};
