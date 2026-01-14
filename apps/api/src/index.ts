import { sayHello } from "@prisma-finance/core";
import { env } from "../env";
import express, { Response } from "express";
import cors from "cors";

const app = express();

// TODO: Only allow localhost and frontend origins
app.use(cors());

export function foo() {
  return "bar";
}

app.get("/", (_, res: Response) => {
  res.json({
    message: sayHello(),
  });
});

const port = env.PORT;

try {
  app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
  });
} catch (error) {
  console.error(`Error when starting server: ${error}`);
}
