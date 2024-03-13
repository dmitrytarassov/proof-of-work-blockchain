import { Transaction } from "../../src/types/Transaction";

export function removeIdFromTransaction(tx: Transaction): Transaction {
  return {
    ...tx,
    transactionId: "",
  };
}
