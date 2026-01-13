import { expect, test } from "vitest";
import { sayHello } from ".";

test("sayHello() has 'hello' in it", () => {
  expect(sayHello()).toContain("Hello");
});
