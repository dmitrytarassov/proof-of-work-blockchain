import { registerNodeUrl } from "./api/routes/registerNode";
import { registerNodesBulkUrl } from "./api/routes/registerNodesBulk";
import { postJson } from "./utils/postJson";

export class BlockchainNode {
  public networkNodes: Set<string> = new Set();

  static async broadcast<T = boolean>(
    networkNodes: Set<string>,
    urlPath: string,
    data?: {
      [key: string]: unknown;
    }
  ): Promise<Map<string, T>> {
    const results: Map<string, T> = new Map();
    const requests: Promise<void>[] = [];

    networkNodes.forEach((url) => {
      requests.push(
        new Promise(async (resolve) => {
          if (data) {
            postJson(`${url}${urlPath}`, data).then(async (result) => {
              const json = await result.json();
              results.set(url, json as T);
              resolve();
            });
          } else {
            const result = await fetch(`${url}${urlPath}`, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
            const json = await result.json();
            results.set(url, json as T);
            resolve();
          }
        })
      );
    });

    await Promise.allSettled(requests);

    return results;
  }

  constructor(public readonly currentNodeUrl: string = "") {}

  get _networkNodes(): string[] {
    return [...this.networkNodes.values()];
  }

  registerNewNode(nodeUrl: string) {
    if (!this.networkNodes.has(nodeUrl) && nodeUrl !== this.currentNodeUrl) {
      this.networkNodes.add(nodeUrl);
    }
  }

  async registerAndBroadcastNewNode(nodeUrl: string): Promise<boolean> {
    this.registerNewNode(nodeUrl);

    await BlockchainNode.broadcast(this.networkNodes, registerNodeUrl, {
      newNodeUrl: nodeUrl,
    });

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
