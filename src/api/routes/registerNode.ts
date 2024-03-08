import { Router } from "../../types/Router";

export const registerNodeUrl = "/register-node";

interface RegisterNodeEndpointBody {
  newNodeUrl: string;
}

export const registerNode: Router = (app, blockchain) => {
  app.post(registerNodeUrl, (req, res) => {
    const data = req.body as RegisterNodeEndpointBody;

    blockchain.registerNewNode(data.newNodeUrl);

    res.json({ note: "New node registered successfully with node" });
  });
};
