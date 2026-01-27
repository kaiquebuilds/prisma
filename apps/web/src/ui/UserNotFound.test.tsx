import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { UserNotFound } from "./UserNotFound";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      refresh: mockRefresh,
    }),
  };
});

describe("<UserNotFound />", () => {
  it("Retry button triggers page refresh", async () => {
    render(<UserNotFound />);

    const button = screen.getByRole("button", {
      name: /retry/i,
    });

    fireEvent.click(button);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
