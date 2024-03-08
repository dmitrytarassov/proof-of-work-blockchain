import { Router } from "../../types/Router";

interface TransactionEndpointBody {
  amount: number;
  sender: string;
  recipient: string;
}

export const transaction: Router = (app, blockchain) => {
  app.post("/transaction", (req, res) => {
    const body = req.body as TransactionEndpointBody;
    const { amount, sender, recipient } = body;
    const block = blockchain.createNewTransaction(amount, sender, recipient);
    res.send({ block, note: `Transaction will be added in block ${block}` });
  });
};
