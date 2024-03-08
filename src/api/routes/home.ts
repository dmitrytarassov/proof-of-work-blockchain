import { Router } from "../../types/Router";

export const home: Router = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello world");
  });
};
