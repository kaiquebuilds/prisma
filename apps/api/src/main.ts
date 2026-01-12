import { sayHello } from "@prisma-finance/core";

export function foo() {
  return "bar";
}

console.log("Hello from API");
console.log(sayHello());
