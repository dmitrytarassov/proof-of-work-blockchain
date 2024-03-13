import { getRandomNumber } from "./getRandomNumber";
import { getRandomString } from "./getRandomString";

import { Transaction } from "../../src/types/Transaction";
export function createTransactionData(): Transaction {
  const sender = getRandomString();
  const recipient = getRandomString();
  const amount = getRandomNumber();

  return {
    sender,
    recipient,
    amount,
    transactionId: "",
  };
}
