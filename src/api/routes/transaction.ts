import { Router } from "../../types/Router";

interface TransactionEndpointBody {
  amount: number;
  sender: string;
  recipient: string;
  transactionId: string;
}

export const transactionUrl = "/transaction";

export const transaction: Router = (app, blockchain) => {
  app.post(transactionUrl, (req, res) => {
    const body = req.body as TransactionEndpointBody;
    const { amount, sender, recipient, transactionId } = body;

    const block = blockchain.addTransactionToPendingTransactions({
      amount,
      sender,
      recipient,
      transactionId,
    });

    res.send({ block, note: `Transaction will be added in block ${block}` });
  });
};
