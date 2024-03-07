import { Transaction } from "./Transaction";

export type CurrentBlockData = {
  transactions: Transaction[];
  index: number;
};
