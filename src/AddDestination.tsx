import "./styles/AddDestination.css";
import { useState } from "react";
interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  address: string;
  picture: string;
  continent: string;
  rating: number;
}
interface Props {
  createDestination: (destination: Omit<Destination, "id">) => void;
}

function AddDestination({ createDestination }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const name = (document.getElementById("name") as HTMLTextAreaElement).value;
    const location = (
      document.getElementById("location") as HTMLTextAreaElement
    ).value;
    const country = (document.getElementById("country") as HTMLTextAreaElement)
      .value;
    const continent = (
      document.getElementById("continent") as HTMLTextAreaElement
    ).value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const rating = parseInt(
      (document.getElementById("rating") as HTMLInputElement).value
    );
    const fileInput = document.getElementById("file") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (
      !name ||
      !location ||
      !country ||
      !continent ||
      !description ||
      isNaN(rating)
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newDestination = {
      name,
      location,
      country,
      continent,
      description,
      rating,
      picture: file ? file.name : "",
      address: `${location}, ${country}, ${continent}`,
    };

    console.log(newDestination);

    createDestination(newDestination);
    alert("Destination saved!");

    (document.getElementById("name") as HTMLTextAreaElement).value = "";
    (document.getElementById("location") as HTMLTextAreaElement).value = "";
    (document.getElementById("country") as HTMLTextAreaElement).value = "";
    (document.getElementById("continent") as HTMLTextAreaElement).value = "";
    (document.getElementById("description") as HTMLTextAreaElement).value = "";
    (document.getElementById("file") as HTMLInputElement).value = "";
    (document.getElementById("rating") as HTMLInputElement).value = "";
    setPreview(null);
  };

  return (
    <div className="add-dest">
      <h2>Create a new attraction</h2>
      <div className="create-cont">
        <div className="column-cont">
          <textarea
            id="name"
            className="small-cont"
            placeholder="Name"
          ></textarea>
          <textarea
            id="location"
            className="small-cont"
            placeholder="Location"
          ></textarea>
          <textarea
            id="country"
            className="small-cont"
            placeholder="Country"
          ></textarea>
          <textarea
            id="continent"
            className="small-cont"
            placeholder="Continent"
          ></textarea>
          <textarea
            id="rating"
            className="small-cont"
            placeholder="Rating"
          ></textarea>
          <input
            type="file"
            id="file"
            className="hidden-file"
            onChange={handleFileChange}
          />
          <label htmlFor="file" className="custom-file-button">
            Upload Picture
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100px", height: "100px" }}
              data-testid="preview-image"
            />
          )}
        </div>
        <textarea
          id="description"
          className="description"
          placeholder="Description"
        ></textarea>
      </div>
      <button
        type="button"
        className="save-button"
        onClick={handleSave}
        data-testid="save-form-button"
      >
        Save
      </button>
    </div>
  );
}

export default AddDestination;
