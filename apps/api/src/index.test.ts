import { expect, test } from "vitest";

function foo() {
  return "bar";
}

test("foo() returns 'bar'", () => {
  expect(foo()).toBe("bar");
});
