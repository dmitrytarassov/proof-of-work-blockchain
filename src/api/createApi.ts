import bodyParser from "body-parser";
import express, { Express } from "express";

import { blockchain } from "./routes/blockchain";
import { home } from "./routes/home";
import { mine } from "./routes/mine";
import { registerAndBroadcastNode } from "./routes/registerAndBroadcastNode";
import { registerNode } from "./routes/registerNode";
import { registerNodesBulk } from "./routes/registerNodesBulk";
import { transaction } from "./routes/transaction";

import { Blockchain } from "../blockchain";

export function createApi(
  port: string | number,
  nodeUrl: string,
  _blockchain: Blockchain
): Express {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  home(app, _blockchain);
  blockchain(app, _blockchain);
  transaction(app, _blockchain);
  mine(app, _blockchain);
  registerAndBroadcastNode(app, _blockchain);
  registerNode(app, _blockchain);
  registerNodesBulk(app, _blockchain);

  app.listen(port);

  return app;
}
