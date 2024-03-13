import { Block } from "../../src/types/Block";

export function removeTimestamp(block: Block): Block {
  return {
    ...block,
    timestamp: 0,
  };
}
