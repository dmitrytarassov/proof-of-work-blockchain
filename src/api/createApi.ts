import bodyParser from "body-parser";
import express, { Express } from "express";

import { blockchain } from "./routes/blockchain";
import { consensus } from "./routes/consensus";
import { home } from "./routes/home";
import { mine } from "./routes/mine";
import { receiveNewBlock } from "./routes/receiveNewBlock";
import { registerAndBroadcastNode } from "./routes/registerAndBroadcastNode";
import { registerNode } from "./routes/registerNode";
import { registerNodesBulk } from "./routes/registerNodesBulk";
import { transaction } from "./routes/transaction";
import { transactionBroadcast } from "./routes/transactionBroadcast";

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
  transactionBroadcast(app, _blockchain);
  receiveNewBlock(app, _blockchain);
  consensus(app, _blockchain);

  app.listen(port);

  return app;
}
