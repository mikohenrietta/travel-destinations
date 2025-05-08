import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Header from "./Header";
import Home from "./Home";
import AllDestinations from "./AllDestinations";
import AddDestination from "./AddDestination";
import AttractionDetails from "./AttractionDetails";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { offlineService } from "./services/offlineService";
import axios from "axios";

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

//const API_URL = "http://172.30.245.117:3000/destinations";
const API_URL = "http://localhost:3000/destinations";

function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const { isOnline, isServerOnline } = useNetworkStatus();
  const isFullyOnline = isOnline && isServerOnline;

  /*useEffect(() => {
    if (isFullyOnline) {
      offlineService.processQueue().then(() => {
        fetchDestinations();
      });
    } else {
      const localData = localStorage.getItem("destinations");
      if (localData) {
        setDestinations(JSON.parse(localData));
      }
    }
  }, [isFullyOnline]);*/

  useEffect(() => {
    if (isFullyOnline) {
      axios
        .get(API_URL)
        .then((res) => setDestinations(res.data))
        .catch((err) => console.error("Error fetching destinations:", err));
    }
  }, [isFullyOnline]);

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(API_URL);
      setDestinations(res.data);
    } catch (error) {
      if (!isFullyOnline) {
        const localData = localStorage.getItem("destinations");
        if (localData) {
          setDestinations(JSON.parse(localData));
        }
      }
    }
  };

  const deleteDestination = (id: number) => {
    if (isFullyOnline) {
      axios
        .delete(`${API_URL}/${id}`)
        .then(() => setDestinations(destinations.filter((d) => d.id !== id)))
        .catch(console.error);
    } else {
      offlineService.addToQueue({
        type: "DELETE",
        payload: { id },
      });
      setDestinations(destinations.filter((d) => d.id !== id));
      localStorage.setItem(
        "destinations",
        JSON.stringify(destinations.filter((d) => d.id !== id))
      );
    }
  };
  const createDestination = (newDestination: Omit<Destination, "id">) => {
    console.log("Creating destination:", newDestination);

    if (isFullyOnline) {
      console.log("Sending to server:", {
        url: API_URL,
        data: newDestination,
        isFullyOnline,
      });
      console.log("Data validation:", {
        hasName: !!newDestination.name,
        hasLocation: !!newDestination.address,
        hasCountry: !!newDestination.country,
        hasContinent: !!newDestination.continent,
        hasDescription: !!newDestination.description,
        isValidRating: !isNaN(newDestination.rating),
        hasPicture: !!newDestination.picture,
        fullObject: newDestination,
      });
      axios
        .post(API_URL, newDestination)
        .then((res) => setDestinations((prev) => [...prev, res.data]))
        .catch((err) => {
          console.error("Error saving destination:", err);
          console.log("Error response data:", err.response?.data); // This is crucial
          console.log("Request config:", err.config); // Shows what was sent
          alert("Failed to save destination. Please try again.");
        });
    } else {
      const newId = Date.now();
      const offlineDestination = { ...newDestination, id: newId };

      offlineService.addToQueue({
        type: "CREATE",
        payload: offlineDestination,
      });

      setDestinations((prev) => [...prev, offlineDestination]);

      const savedLocal = JSON.parse(
        localStorage.getItem("destinations") || "[]"
      );
      localStorage.setItem(
        "destinations",
        JSON.stringify([...savedLocal, offlineDestination])
      );
    }
  };

  const updateDestination = (updatedDestination: Destination) => {
    if (isFullyOnline) {
      axios
        .patch(`${API_URL}/${updatedDestination.id}`, updatedDestination)
        .then(() => {
          setDestinations((prev) =>
            prev.map((d) =>
              d.id === updatedDestination.id ? updatedDestination : d
            )
          );
        })
        .catch(console.error);
    } else {
      offlineService.addToQueue({
        type: "UPDATE",
        payload: updatedDestination,
      });
      setDestinations((prev) =>
        prev.map((d) =>
          d.id === updatedDestination.id ? updatedDestination : d
        )
      );
      localStorage.setItem(
        "destinations",
        JSON.stringify(
          destinations.map((d) =>
            d.id === updatedDestination.id ? updatedDestination : d
          )
        )
      );
    }
  };

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">Network Offline - Working Locally</div>
      )}
      {isOnline && !isServerOnline && (
        <div className="offline-banner">
          Server Unavailable - Working Locally
        </div>
      )}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/seeall"
          element={
            <AllDestinations
              destinations={destinations}
              deleteDestination={deleteDestination}
              updateDestination={updateDestination}
            />
          }
        />
        <Route
          path="/add"
          element={
            <AddDestination
              setDestinations={setDestinations}
              createDestination={createDestination}
            />
          }
        />
        <Route
          path="/attraction/:name"
          element={<AttractionDetails destinations={destinations} />}
        />
      </Routes>
    </div>
  );
}

export default App;
