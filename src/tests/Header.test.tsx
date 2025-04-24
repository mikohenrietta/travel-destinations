import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect } from "vitest";
import Header from "../Header";

describe("Header Component", () => {
  test("renders the site title", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText("TravelDestinations")).toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see all/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /charts/i })).toBeInTheDocument();
  });

  test("navigation links have correct href attributes", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /start/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /see all/i })).toHaveAttribute(
      "href",
      "/seeall"
    );
    expect(screen.getByRole("link", { name: /add/i })).toHaveAttribute(
      "href",
      "/add"
    );
    expect(screen.getByRole("link", { name: /charts/i })).toHaveAttribute(
      "href",
      "/charts"
    );
  });

  test("includes material icons in navigation links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const startLink = screen.getByText(/start/i);
    const seeAllLink = screen.getByText(/see all/i);
    const addLinks = screen.getAllByText(/add/i);
    const addLink = addLinks[0];
    const chartsLink = screen.getByText(/charts/i);

    expect(startLink.querySelector(".material-icons")).toHaveTextContent(
      "home"
    );
    expect(seeAllLink.querySelector(".material-icons")).toHaveTextContent(
      "apps"
    );
    expect(addLink.querySelector(".material-icons")).toHaveTextContent("add");
    expect(chartsLink.querySelector(".material-icons")).toHaveTextContent(
      "equalizer"
    );
  });

  test("has correct CSS classes applied", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole("banner")).toHaveClass("navbar");
  });
});
