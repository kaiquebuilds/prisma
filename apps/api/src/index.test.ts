import { expect, test } from "vitest";

import { foo } from "./app";

test("foo() returns 'bar'", () => {
  expect(foo()).toBe("bar");
});
