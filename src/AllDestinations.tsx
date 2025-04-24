import { useEffect, useState } from "react";
import Attraction from "./components/Attraction";
import "./styles/AllDestinations.css";

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
  destinations: Destination[];
  deleteDestination: (id: number) => void;
  updateDestination: (updatedDestination: Destination) => void;
}

function AllDestinations({
  destinations,
  deleteDestination,
  updateDestination,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDestination, setEditedDestination] =
    useState<Destination | null>(null);
  const [sortCriteria, setSortCriteria] = useState<
    "name" | "country" | "continent" | null
  >(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const ITEMS_INCREMENT = 6;

  const handleFilterClick = (continent: string | null) => {
    setSelectedContinent(continent);
    setVisibleCount(6);
  };

  const handleEditClick = (destination: Destination) => {
    setEditingId(destination.id);
    setEditedDestination({ ...destination });
  };

  const handleSaveClick = () => {
    if (editedDestination) {
      updateDestination({
        ...editedDestination,
        rating: Number(editedDestination.rating),
      });
    }
    setEditingId(null);
    setEditedDestination(null);
  };

  const handleInputChange = (field: keyof Destination, value: string) => {
    if (!editedDestination) return;
    const updatedValue = field === "rating" ? Number(value) : value;
    setEditedDestination({ ...editedDestination, [field]: updatedValue });
  };

  const handleSortClick = (criteria: "name" | "country" | "continent") => {
    setSortCriteria(criteria);
    setVisibleCount(6);
  };

  const filteredData = destinations.filter((destination) => {
    const matchesContinent = selectedContinent
      ? destination.continent === selectedContinent
      : true;
    const matchesSearch =
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortCriteria === "name") return a.name.localeCompare(b.name);
    if (sortCriteria === "country") return a.country.localeCompare(b.country);
    if (sortCriteria === "continent")
      return a.continent.localeCompare(b.continent);
    return 0;
  });

  const getRatingThresholds = (data: Destination[]) => {
    if (data.length === 0) return { topRating: null, bottomRating: null };
    const sortedRatings = data.map((d) => d.rating).sort((a, b) => b - a);
    const total = sortedRatings.length;
    const topThirdIndex = Math.ceil(total / 3) - 1;
    const bottomThirdIndex = Math.floor((2 * total) / 3);
    return {
      topRating: sortedRatings[topThirdIndex] ?? 0,
      bottomRating: sortedRatings[bottomThirdIndex] ?? 0,
    };
  };

  const { topRating, bottomRating } = getRatingThresholds(sortedData);

  const getRatingIcon = (destination: Destination) => {
    if (topRating === null || bottomRating === null) return "";
    if (destination.rating > topRating) return "❤️";
    if (destination.rating < bottomRating) return "💔";
    return "⭐";
  };

  const currentDestinations = sortedData.slice(0, visibleCount);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      if (scrollTop + windowHeight >= fullHeight - 50) {
        setVisibleCount((prev) =>
          prev + ITEMS_INCREMENT > sortedData.length
            ? sortedData.length
            : prev + ITEMS_INCREMENT
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sortedData]);

  return (
    <div className="traveldests">
      <h2>Best Bucket List Travel Destinations</h2>

      <div className="search">
        <input
          type="text"
          className="searchbar"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(6);
          }}
        />
        <button className="searchbutton">
          <span className="material-icons">search</span>
        </button>

        <div className="filter-container">
          <button className="filterbutton">
            <span className="material-icons">filter_alt</span>
          </button>
          <ul className="filter-dropdown">
            {["Africa", "Asia", "Europe", "North America", "South America"].map(
              (continent) => (
                <li
                  key={continent}
                  onClick={() => handleFilterClick(continent)}
                >
                  {continent}
                </li>
              )
            )}
            <li onClick={() => handleFilterClick(null)}>All Destinations</li>
          </ul>
        </div>

        <div className="filter-container">
          <button className="filterbutton">
            <span className="material-icons">sort</span>
          </button>
          <ul className="filter-dropdown">
            <li onClick={() => handleSortClick("name")}>Sort By Name</li>
            <li onClick={() => handleSortClick("country")}>Sort By Country</li>
            <li onClick={() => handleSortClick("continent")}>
              Sort By Continent
            </li>
          </ul>
        </div>
      </div>

      <div>
        {currentDestinations.length > 0 ? (
          currentDestinations.map((destination) => (
            <div
              className="dest"
              key={destination.id}
              data-testid="attraction-component"
            >
              {editingId === destination.id ? (
                <div className="edit-form" data-testid="form-component">
                  <input
                    type="text"
                    value={editedDestination?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <input
                    type="text"
                    value={editedDestination?.country || ""}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={editedDestination?.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={editedDestination?.rating || ""}
                    onChange={(e) =>
                      handleInputChange("rating", e.target.value)
                    }
                  />
                  <textarea
                    value={editedDestination?.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  <button
                    className="save-form-button"
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="dest-rating" data-testid="destination-rating">
                    {getRatingIcon(destination)}
                  </div>
                  <Attraction
                    name={destination.name}
                    country={destination.country}
                    description={destination.description}
                    address={destination.address}
                    image={destination.picture}
                    rating={destination.rating}
                  />
                  <button
                    className="delete-button"
                    onClick={() => deleteDestination(destination.id)}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(destination)}
                  >
                    <span className="material-icons">edit</span>
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No destinations found.</p>
        )}
      </div>
    </div>
  );
}

export default AllDestinations;
