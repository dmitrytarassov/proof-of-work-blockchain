import sha256 from "sha256";

import { CurrentBlockData } from "../types/CurrentBlockData";

export function hashBlock(
  previousBlockHash: string,
  currentBlockData: CurrentBlockData,
  nonce: number
): string {
  const dataString = [
    previousBlockHash,
    nonce,
    JSON.stringify(currentBlockData),
  ].join("");
  return sha256(dataString);
}
