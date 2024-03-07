import bodyParser from "body-parser";
import express from "express";
import * as uuid from "uuid";

import { Blockchain } from "./blockchain";

const nodeAddress = uuid.v1().split("-").join("");

const blockchain = new Blockchain(nodeAddress);

interface TransactionEndpointBody {
  amount: number;
  sender: string;
  recipient: string;
}

const app = express();

const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/blockchain", (req, res) => {
  res.send(blockchain);
});

app.post("/transaction", (req, res) => {
  const body = req.body as TransactionEndpointBody;
  const { amount, sender, recipient } = body;
  const block = blockchain.createNewTransaction(amount, sender, recipient);
  res.send({ block, note: `Transaction will be added in block ${block}` });
});

app.get("/mine", (req, res) => {
  const newBlock = blockchain.mine();

  res.json({
    note: "New block mined successfully",
    block: newBlock,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});
