import { Express } from "express";

import { Blockchain } from "../blockchain";

export interface Router {
  (app: Express, blockchain: Blockchain): void;
}
