import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, test, expect } from "vitest";
import AttractionDetails from "../AttractionDetails";

const mockDestinations = [
  {
    name: "EiffelTower",
    country: "France",
    description: "Iconic tower in Paris",
    address: "Paris, France, Europe",
    picture: "eiffel.jpg",
    continent: "Europe",
    rating: 5,
  },
  {
    name: "GreatWall",
    country: "China",
    description: "Ancient wall in China",
    address: "China, Asia",
    picture: "wall.jpg",
    continent: "Asia",
    rating: 4,
  },
  {
    name: "StatueOfLiberty",
    country: "USA",
    description: "Iconic statue in New York",
    address: "New York, USA, North America",
    picture: "liberty.jpg",
    continent: "North America",
    rating: 3,
  },
];

describe("AttractionDetails", () => {
  test("renders attraction details from URL params", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/attraction/EiffelTower?desc=Iconic%20tower%20in%20Paris&addr=Paris%2C%20France%2C%20Europe&img=eiffel.jpg&rating=5",
        ]}
      >
        <Routes>
          <Route
            path="/attraction/:name"
            element={<AttractionDetails destinations={mockDestinations} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("The EiffelTower")).toBeInTheDocument();
    expect(screen.getByText("Iconic tower in Paris")).toBeInTheDocument();
    expect(screen.getByText("Rating: 5")).toBeInTheDocument();
    expect(screen.getByText("Paris, France, Europe")).toBeInTheDocument();
    expect(screen.getByAltText("EiffelTower")).toHaveAttribute(
      "src",
      "eiffel.jpg"
    );
  });

  test("renders attraction details from props when URL params are missing", () => {
    render(
      <MemoryRouter initialEntries={["/attraction/EiffelTower"]}>
        <Routes>
          <Route
            path="/attraction/:name"
            element={<AttractionDetails destinations={mockDestinations} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("The EiffelTower")).toBeInTheDocument();
    expect(screen.getByText("Iconic tower in Paris")).toBeInTheDocument();
    expect(screen.getByText("Rating: 5")).toBeInTheDocument();
    expect(screen.getByText("Paris, France, Europe")).toBeInTheDocument();
    expect(screen.getByAltText("EiffelTower")).toHaveAttribute(
      "src",
      "eiffel.jpg"
    );
  });

  test('shows "Attraction not found" for invalid attraction', () => {
    render(
      <MemoryRouter initialEntries={["/attraction/InvalidAttraction"]}>
        <Routes>
          <Route
            path="/attraction/:name"
            element={<AttractionDetails destinations={mockDestinations} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Attraction not found")).toBeInTheDocument();
  });

  test("navigation buttons work correctly", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/attraction/GreatWall"]}>
        <Routes>
          <Route
            path="/attraction/:name"
            element={<AttractionDetails destinations={mockDestinations} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Test previous button
    const prevButton = screen.getByTestId("prev-button");
    fireEvent.click(prevButton);
    expect(container.querySelector("h2")?.textContent).toBe("The EiffelTower");

    // Test next button
    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);
    expect(container.querySelector("h2")?.textContent).toBe("The GreatWall");
  });

  test("disables previous button on first attraction", () => {
    render(
      <MemoryRouter initialEntries={["/attraction/EiffelTower"]}>
        <Routes>
          <Route
            path="/attraction/:name"
            element={<AttractionDetails destinations={mockDestinations} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText("Previous attraction")
    ).not.toBeInTheDocument();
  });

  test("disables next button on last attraction", () => {
    render(
      <MemoryRouter initialEntries={["/attraction/StatueOfLiberty"]}>
        <Routes>
          <Route
            path="/attraction/:name"
            element={<AttractionDetails destinations={mockDestinations} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByLabelText("Next attraction")).not.toBeInTheDocument();
  });
});
