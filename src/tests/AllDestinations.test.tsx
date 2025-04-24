import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllDestinations from "../AllDestinations";
import { describe, test, expect, vi } from "vitest";

// Mock destinations data
const mockDestinations = [
  {
    id: 1,
    name: "Eiffel Tower",
    country: "France",
    description: "Iconic tower",
    address: "Paris, France",
    picture: "/eiffel.jpg",
    continent: "Europe",
    rating: 5,
  },
  {
    id: 2,
    name: "Great Wall",
    country: "China",
    description: "Historic wall",
    address: "China",
    picture: "/greatwall.jpg",
    continent: "Asia",
    rating: 4,
  },
  {
    id: 3,
    name: "Statue of Liberty",
    country: "USA",
    description: "Symbol of freedom",
    address: "New York, USA",
    picture: "/statue.jpg",
    continent: "North America",
    rating: 3,
  },
  {
    id: 4,
    name: "Colosseum",
    country: "Italy",
    description: "Ancient amphitheater",
    address: "Rome, Italy",
    picture: "/colosseum.jpg",
    continent: "Europe",
    rating: 5,
  },
  {
    id: 5,
    name: "Machu Picchu",
    country: "Peru",
    description: "Incan citadel",
    address: "Cusco Region, Peru",
    picture: "/machupicchu.jpg",
    continent: "South America",
    rating: 5,
  },
];

// Mock functions
const mockDeleteDestination = vi.fn();
const mockUpdateDestination = vi.fn();

describe("AllDestinations Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders all destinations", () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Eiffel Tower, France")).toBeInTheDocument();
    expect(screen.getByText("Great Wall, China")).toBeInTheDocument();
    expect(screen.getByText("Statue of Liberty, USA")).toBeInTheDocument();
  });

  test("sorts destinations by name", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    // Click the sort button
    const sortButtons = screen.getAllByRole("button", { name: /sort/i });
    const sortButton = sortButtons.find(
      (button) =>
        button.querySelector(".material-icons")?.textContent === "sort"
    );
    if (sortButton) {
      fireEvent.click(sortButton);
    }

    // Click "Sort By Name" once it's visible
    const sortByNameOption = await screen.findByText("Sort By Name");
    fireEvent.click(sortByNameOption);

    // Ensure all items are shown
    const itemsPerPageDropdown = screen.getByLabelText(
      /Destinations per page:/i
    );
    fireEvent.change(itemsPerPageDropdown, {
      target: { value: mockDestinations.length.toString() },
    });

    // Wait until the correct number of destinations is rendered
    await waitFor(() =>
      expect(screen.getAllByTestId("attraction-component").length).toBe(
        mockDestinations.length
      )
    );

    // Sort mock data correctly
    const sortedDestinations = [...mockDestinations]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((dest) => `${dest.name}, ${dest.country}`);

    // Wait for the UI to update
    await waitFor(() => {
      const attractionComponents = screen.getAllByTestId(
        "attraction-component"
      );
      const renderedNames = attractionComponents
        .map((comp) => comp.querySelector("a")?.textContent?.trim())
        .filter(Boolean);

      expect(renderedNames).toEqual(sortedDestinations);
    });
  });

  test("sorts destinations by country", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );
    const itemsPerPageDropdown = screen.getByLabelText(
      /Destinations per page:/i
    );
    fireEvent.change(itemsPerPageDropdown, {
      target: { value: mockDestinations.length.toString() },
    });
    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    const sortByCountryOption = await screen.findByText("Sort By Country");
    fireEvent.click(sortByCountryOption);

    await waitFor(() => {
      const destinationLinks = screen.getAllByRole("link");
      const renderedNames = destinationLinks.map((link) => link.textContent);
      const sortedNames = [...mockDestinations]
        .sort((a, b) => a.country.localeCompare(b.country))
        .map((dest) => `${dest.name}, ${dest.country}`);
      expect(renderedNames).toEqual(sortedNames);
    });
  });

  test("filters destinations by continent", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const filterButton = screen.getByRole("button", { name: /filter/i });
    fireEvent.click(filterButton);

    const europeOption = await screen.findByText("Europe");
    fireEvent.click(europeOption);

    await waitFor(() => {
      expect(screen.getByText("Eiffel Tower, France")).toBeInTheDocument();
      expect(screen.getByText("Colosseum, Italy")).toBeInTheDocument();
      expect(screen.queryByText("Great Wall, China")).not.toBeInTheDocument();
    });
  });

  test("shows all destinations when 'All' filter is selected", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );
    const itemsPerPageDropdown = screen.getByLabelText(
      /Destinations per page:/i
    );
    fireEvent.change(itemsPerPageDropdown, {
      target: { value: mockDestinations.length.toString() },
    });
    const filterButton = screen.getByRole("button", { name: /filter/i });
    fireEvent.click(filterButton);

    const allOption = await screen.findByText("All Destinations");
    fireEvent.click(allOption);

    await waitFor(() => {
      mockDestinations.forEach((dest) => {
        expect(
          screen.getByRole("link", { name: `${dest.name}, ${dest.country}` })
        ).toBeInTheDocument();
      });
    });
  });

  test("handles search functionality", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Eiffel" } });

    await waitFor(() => {
      expect(screen.getByText("Eiffel Tower, France")).toBeInTheDocument();
      expect(screen.queryByText("Great Wall, China")).not.toBeInTheDocument();
    });
  });

  test("displays 'No destinations found' when search yields no results", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Non-existent" } });

    await waitFor(() => {
      expect(screen.getByText("No destinations found.")).toBeInTheDocument();
    });
  });

  test("handles rating display correctly", () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );
    const itemsPerPageDropdown = screen.getByLabelText(
      /Destinations per page:/i
    );
    fireEvent.change(itemsPerPageDropdown, {
      target: { value: mockDestinations.length.toString() },
    });
    const allRatings = screen.getAllByTestId("destination-rating");
    expect(allRatings.length).toBe(mockDestinations.length);
  });

  test("delete destination button works", () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const firstDeleteButton = screen.getAllByRole("button", {
      name: /delete/i,
    })[0];
    fireEvent.click(firstDeleteButton);

    expect(mockDeleteDestination).toHaveBeenCalledWith(1); // ID of Eiffel Tower
  });

  test("edit destination button shows form", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const firstEditButton = screen.getAllByRole("button", { name: /edit/i })[0];
    fireEvent.click(firstEditButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Eiffel Tower")).toBeInTheDocument();
      expect(screen.getByDisplayValue("France")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Paris, France")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Iconic tower")).toBeInTheDocument();
    });
  });

  test("handles form submission for editing", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const firstEditButton = screen.getAllByRole("button", { name: /edit/i })[0];
    fireEvent.click(firstEditButton);

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue("Eiffel Tower");
      const saveButton = screen.getByText("Save");

      fireEvent.change(nameInput, { target: { value: "Updated Tower" } });
      fireEvent.click(saveButton);

      expect(mockUpdateDestination).toHaveBeenCalledWith({
        ...mockDestinations[0],
        name: "Updated Tower",
      });
    });
  });

  /*test("handles canceling edit form", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const firstEditButton = screen.getAllByRole("button", { name: /edit/i })[0];
    fireEvent.click(firstEditButton);

    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);
      expect(
        screen.queryByDisplayValue("Eiffel Tower")
      ).not.toBeInTheDocument();
    });
  });*/

  test("pagination works correctly", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    // Default items per page (3) should show first 3 destinations
    expect(screen.getByText("Eiffel Tower, France")).toBeInTheDocument();
    expect(screen.getByText("Great Wall, China")).toBeInTheDocument();
    expect(screen.getByText("Statue of Liberty, USA")).toBeInTheDocument();
    expect(screen.queryByText("Colosseum, Italy")).not.toBeInTheDocument();

    // Test pagination navigation
    const nextButton = screen.getByText("Next →");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Eiffel Tower, France")
      ).not.toBeInTheDocument();
    });

    // Change items per page to 5
    const itemsPerPageSelect = screen.getByLabelText("Destinations per page:");
    fireEvent.change(itemsPerPageSelect, { target: { value: "5" } });

    await waitFor(() => {
      expect(screen.getByText("Colosseum, Italy")).toBeInTheDocument();
      expect(screen.getByText("Machu Picchu, Peru")).toBeInTheDocument();
    });
  });

  test("handles all destinations per page selection", async () => {
    render(
      <MemoryRouter>
        <AllDestinations
          destinations={mockDestinations}
          deleteDestination={mockDeleteDestination}
          updateDestination={mockUpdateDestination}
        />
      </MemoryRouter>
    );

    const itemsPerPageDropdown = screen.getByLabelText(
      /Destinations per page:/i
    );
    fireEvent.change(itemsPerPageDropdown, {
      target: { value: mockDestinations.length.toString() },
    });
    await waitFor(() => {
      mockDestinations.forEach((dest) => {
        expect(
          screen.getByText(`${dest.name}, ${dest.country}`)
        ).toBeInTheDocument();
      });
    });
  });
});
