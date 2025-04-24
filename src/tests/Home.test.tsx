import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect } from "vitest";
import Home from "../Home";

describe("Home Component", () => {
  test("renders the main heading", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Best Travel Destinations"
    );
  });

  test("renders the Get Started button/link", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const startButton = screen.getByRole("link", { name: /get started/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveClass("startbutton");
  });

  test("Get Started link points to /seeall", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/seeall"
    );
  });

  test("has correct CSS classes applied", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId("home-container")).toHaveClass("title-container");
  });

  /*test("matches snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });*/
});
