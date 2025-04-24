import "./styles/AddDestination.css";
import { useState } from "react";

interface Props {
  setDestinations: React.Dispatch<React.SetStateAction<any[]>>;
}

function AddDestination({ setDestinations }: Props) {
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

  const handleSave = () => {
    event?.preventDefault();
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
    const fileInput = document.getElementById("file") as HTMLInputElement;
    const rating = (document.getElementById("rating") as HTMLTextAreaElement)
      .value;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (!name || !location || !country || !continent || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const newDestination = {
      name,
      location,
      country,
      continent,
      description,
      picture: file ? URL.createObjectURL(file) : null,
      address: `${location}, ${country}, ${continent}`,
      rating,
    };

    setDestinations((prev) => [...prev, newDestination]);

    alert("Destination saved successfully!");

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
