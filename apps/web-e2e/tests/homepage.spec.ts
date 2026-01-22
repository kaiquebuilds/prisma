import { test, expect } from "@playwright/test";

test("/ says 'Hello'", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { level: 1 });

  await expect(heading).toHaveText(/Hello/i);
});
