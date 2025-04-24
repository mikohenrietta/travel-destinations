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

  useEffect(() => {
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
  }, [isFullyOnline]);

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
          element={<AddDestination setDestinations={setDestinations} />}
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
