import { registerNodeUrl } from "./api/routes/registerNode";
import { registerNodesBulkUrl } from "./api/routes/registerNodesBulk";
import { postJson } from "./utils/postJson";

export class BlockchainNode {
  public networkNodes: Set<string> = new Set();

  constructor(private readonly currentNodeUrl: string = "") {}

  registerNewNode(nodeUrl: string) {
    if (!this.networkNodes.has(nodeUrl) && nodeUrl !== this.currentNodeUrl) {
      this.networkNodes.add(nodeUrl);
    }
  }

  async registerAndBroadcastNewNode(nodeUrl: string): Promise<boolean> {
    this.registerNewNode(nodeUrl);

    const requests: Promise<void>[] = [];

    this.networkNodes.forEach((url) => {
      requests.push(
        new Promise((resolve) => {
          postJson(`${url}${registerNodeUrl}`, { newNodeUrl: nodeUrl }).then(
            () => {
              resolve();
            }
          );
        })
      );
    });

    await Promise.allSettled(requests);

    await postJson(`${nodeUrl}${registerNodesBulkUrl}`, {
      allNetworkNodes: [...this.networkNodes, this.currentNodeUrl],
    });

    return true;
  }

  registerNodesBulk(nodesBulk: string[]) {
    this.networkNodes = new Set(
      nodesBulk.filter((node) => node !== this.currentNodeUrl)
    );
  }
}
