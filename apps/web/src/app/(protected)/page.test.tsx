import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

test("Page has a heading", async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ message: "Hello, world!" }));

  const page = await Page();

  render(page);

  expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
    "Hello",
  );
});
