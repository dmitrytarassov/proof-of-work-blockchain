import { Router } from "../../types/Router";

export const registerNodesBulkUrl = "/register-nodes-bulk";

interface RegisterNodesBulkEndpointBody {
  allNetworkNodes: string[];
}

export const registerNodesBulk: Router = (app, blockchain) => {
  app.post(registerNodesBulkUrl, (req, res) => {
    const data = req.body as RegisterNodesBulkEndpointBody;

    blockchain.registerNodesBulk(data.allNetworkNodes);
    res.send({ note: "Nodes bulk registered" });
  });
};
