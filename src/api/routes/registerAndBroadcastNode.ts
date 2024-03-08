import { Router } from "../../types/Router";

export const registerAndBroadcastNodeUrl = "/register-and-broadcast-node";

interface RegisterAndBroadcastNodeEndpointBody {
  newNodeUrl: string;
}

export const registerAndBroadcastNode: Router = (app, blockchain) => {
  app.post(registerAndBroadcastNodeUrl, async (req, res) => {
    const data = req.body as RegisterAndBroadcastNodeEndpointBody;
    const success = await blockchain.registerAndBroadcastNewNode(
      data.newNodeUrl
    );

    if (success) {
      res.json({ note: "New node registered successfully" });
    } else {
      res.json({ note: "Error while registering new node" });
    }
  });
};
