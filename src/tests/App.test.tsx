import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import App from "../App";
import { Link } from "react-router-dom";

// Mock child components to isolate App component testing
vi.mock("../Header", () => ({
  default: () => (
    <div>
      Header Mock
      <Link to="/add">Add</Link> {/* Ensure this matches your real app */}
    </div>
  ),
}));

vi.mock("../Home", () => ({
  default: () => <div>Home Mock</div>,
}));

vi.mock("../AllDestinations", () => ({
  default: () => <div>AllDestinations Mock</div>,
}));

vi.mock("../AddDestination", () => ({
  default: () => <div>AddDestination Mock - Create a new attraction</div>,
}));

vi.mock("../AttractionDetails", () => ({
  default: () => <div>AttractionDetails Mock</div>,
}));

describe("App Component", () => {
  test("renders Header component", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Header Mock")).toBeInTheDocument();
  });

  test("renders Home component for root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Home Mock")).toBeInTheDocument();
  });

  test("renders AllDestinations component for /seeall route", () => {
    render(
      <MemoryRouter initialEntries={["/seeall"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("AllDestinations Mock")).toBeInTheDocument();
  });

  test("renders AddDestination component for /add route", () => {
    render(
      <MemoryRouter initialEntries={["/add"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("AddDestination Mock - Create a new attraction")
    ).toBeInTheDocument();
  });

  test("renders AttractionDetails component for /attraction/:name route", () => {
    render(
      <MemoryRouter initialEntries={["/attraction/eiffel-tower"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("AttractionDetails Mock")).toBeInTheDocument();
  });

  /*test("passes correct props to AllDestinations", () => {
    // This test would require unmocking AllDestinations to verify props
    // For now we're just testing the routing behavior
    render(
      <MemoryRouter initialEntries={["/seeall"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("AddDestination Mock - Create a new attraction")
    ).toBeInTheDocument();
  });*/

  test("navigates to Add Destination page", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add")); // Adjust the button text accordingly

    await waitFor(() =>
      expect(
        screen.getByText("AddDestination Mock - Create a new attraction")
      ).toBeInTheDocument()
    );
  });
});
