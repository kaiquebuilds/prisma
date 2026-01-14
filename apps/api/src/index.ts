import { sayHello } from "@prisma-finance/core";
import { env } from "../env";
import express, { Response } from "express";

const app = express();

const port = env.PORT;

export function foo() {
  return "bar";
}

app.get("/", (_, res: Response) => {
  res.send(sayHello());
});

try {
  app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
  });
} catch (error) {
  console.error(`Error when starting server: ${error}`);
}
