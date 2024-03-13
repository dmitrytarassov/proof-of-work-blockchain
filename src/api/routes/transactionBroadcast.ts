import { Router } from "../../types/Router";

interface TransactionBroadcastEndpointBody {
  amount: number;
  sender: string;
  recipient: string;
}

export const transactionUrlBroadcast = "/transaction/broadcast";

export const transactionBroadcast: Router = (app, blockchain) => {
  app.post(transactionUrlBroadcast, async (req, res) => {
    const body = req.body as TransactionBroadcastEndpointBody;
    const { amount, sender, recipient } = body;

    const block = await blockchain.createNewTransactionAndBroadcast(
      amount,
      sender,
      recipient
    );

    res.send({
      block,
      note: "Transaction created and broadcast successfully",
    });
  });
};
