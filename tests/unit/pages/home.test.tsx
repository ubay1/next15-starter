/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/page";

describe("Home page", () => {
  it("greeting home page", () => {
    render(<Page />);
    expect(screen.getByTestId("heading-greet").textContent).toBe(
      "Hallo developer this is nextjs 15 starter"
    );
    expect(screen.getByTestId("heading-desc").textContent).toBe(
      "Shadcn UI, React Hook Form, Zod, CVA, Tailwind CSS, Zustand, React Query"
    );
  });

  it("example form: display validation error message when submitting empty form", async () => {
    render(<Page />);

    // error message return null
    expect(screen.queryByTestId("home-example-error-msg")).toBeNull();

    const input = screen.getByTestId("home-example-form-input");
    const button = screen.getByTestId("home-example-btn-submit");

    // input with empty value & click btn submit then show error message
    expect(input).toHaveValue("");
    fireEvent.click(button);
    const errorMessage = await screen.findByTestId("home-example-error-msg");
    expect(errorMessage).toBeInTheDocument();
  });

  it("example: display validation error message when submitting less than 3 char", async () => {
    render(<Page />);

    const input = screen.getByTestId("home-example-form-input");
    const button = screen.getByTestId("home-example-btn-submit");

    await userEvent.clear(input); // Pastikan input benar-benar kosong
    await userEvent.type(input, "te"); // Contoh input valid
    await userEvent.click(button);
    expect(screen.getByTestId("home-example-error-msg").textContent).toBe(
      "Username must be at least 3 characters long"
    );
  });
});
