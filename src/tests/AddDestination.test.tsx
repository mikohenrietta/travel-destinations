import { render, fireEvent, screen } from "@testing-library/react";
import AddDestination from "../AddDestination";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "mocked-url");
});

afterAll(() => {
  vi.restoreAllMocks();
});
// Create a mock for setDestinations function
describe("AddDestination", () => {
  const mockSetDestinations = vi.fn();

  beforeEach(() => {
    render(<AddDestination setDestinations={mockSetDestinations} />);
  });

  test("renders all form fields", () => {
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Country")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Continent")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Upload Picture")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("shows validation alert when required fields are empty", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    fireEvent.click(screen.getByText("Save"));
    expect(alertMock).toHaveBeenCalledWith("Please fill in all fields.");
    alertMock.mockRestore();
  });

  test("handles file upload and displays preview", async () => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText("Upload Picture") as HTMLInputElement;

    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(input.files?.[0].name).toBe("test.png");

    // Check if preview is displayed
    const previewImage = await screen.findByTestId(
      "preview-image",
      {},
      { timeout: 2000 }
    );
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute("src");
  });

  /*test("should add new destination and reset the form", async () => {
    // Simulate user input
    fireEvent.change(
      screen.getAllByPlaceholderText(/name/i)[0] as HTMLTextAreaElement,
      { target: { value: "Eiffel Tower" } }
    );
    fireEvent.change(
      screen.getAllByPlaceholderText(/location/i)[0] as HTMLTextAreaElement,
      { target: { value: "Paris" } }
    );
    fireEvent.change(
      screen.getAllByPlaceholderText(/country/i)[0] as HTMLTextAreaElement,
      { target: { value: "France" } }
    );
    fireEvent.change(
      screen.getAllByPlaceholderText(/continent/i)[0] as HTMLTextAreaElement,
      { target: { value: "Europe" } }
    );
    fireEvent.change(
      screen.getAllByPlaceholderText(/rating/i)[0] as HTMLTextAreaElement,
      { target: { value: "5" } }
    );
    fireEvent.change(
      screen.getAllByPlaceholderText(/description/i)[0] as HTMLTextAreaElement,
      { target: { value: "An iconic symbol of France" } }
    );

    // Mock file input change for picture upload (optional)
    const fileInput = screen.getByLabelText(
      /upload picture/i
    ) as HTMLInputElement;
    const file = new File(["image"], "eiffel.jpg", { type: "image/jpg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Simulate submitting the form
    fireEvent.click(screen.getByTestId("save-form-button"));

    // Wait for the mock function to be called and check the destination object passed to setDestinations
    await waitFor(() => {
      expect(mockSetDestinations).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Eiffel Tower",
            location: "Paris",
            country: "France",
            continent: "Europe",
            description: "An iconic symbol of France",
            picture: expect.any(String), // Picture will be a data URL, hence using expect.any(String)
            address: "Paris, France, Europe",
            rating: "5",
          }),
        ])
      );
    });

    // Check if the form fields have been reset
    expect(
      (screen.getAllByPlaceholderText(/name/i)[0] as HTMLTextAreaElement).value
    ).toBe("");
    expect(
      (screen.getAllByPlaceholderText(/location/i)[0] as HTMLTextAreaElement)
        .value
    ).toBe("");
    expect(
      (screen.getAllByPlaceholderText(/country/i)[0] as HTMLTextAreaElement)
        .value
    ).toBe("");
    expect(
      (screen.getAllByPlaceholderText(/continent/i)[0] as HTMLTextAreaElement)
        .value
    ).toBe("");
    expect(
      (screen.getAllByPlaceholderText(/description/i)[0] as HTMLTextAreaElement)
        .value
    ).toBe("");
    expect(
      (screen.getAllByPlaceholderText(/rating/i)[0] as HTMLTextAreaElement)
        .value
    ).toBe("");
    expect(fileInput.files).toHaveLength(0);
  });

  */ test("submits form with correct data", async () => {
    // 1. Use userEvent for more realistic interactions
    const user = userEvent.setup();

    // 2. Fill in all required fields
    await user.type(screen.getByPlaceholderText("Name"), "Eiffel Tower");
    await user.type(screen.getByPlaceholderText("Location"), "Paris");
    await user.type(screen.getByPlaceholderText("Country"), "France");
    await user.type(screen.getByPlaceholderText("Continent"), "Europe");
    await user.type(screen.getByPlaceholderText("Rating"), "5");
    await user.type(
      screen.getByPlaceholderText("Description"),
      "Iconic iron tower"
    );

    // 3. Mock file upload
    const file = new File(["test"], "eiffel.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("Upload Picture");
    await user.upload(input, file);

    // 4. Mock alert to prevent test pollution
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // 5. Submit form
    await user.click(screen.getByText("Save"));

    // 6. Verify the mock was called
    //expect(mockSetDestinations).toHaveBeenCalled();

    // 7. Verify the saved data structure
    const savedDestination = mockSetDestinations.mock.calls[0][0]([])[0];
    expect(savedDestination).toEqual({
      name: "Eiffel Tower",
      location: "Paris",
      country: "France",
      continent: "Europe",
      description: "Iconic iron tower",
      picture: expect.any(String),
      address: "Paris, France, Europe",
      rating: "5",
    });

    // 8. Clean up
    alertMock.mockRestore();
  });
  // FIX THIS
});
