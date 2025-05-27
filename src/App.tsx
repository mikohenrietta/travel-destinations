import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Header from "./Header";
import Home from "./Home";
import AllDestinations from "./AllDestinations";
import AddDestination from "./AddDestination";
import AttractionDetails from "./AttractionDetails";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { offlineService } from "./services/offlineService";
import axios from "axios";
import ChartsPage from "./Charts";

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

const API_URL = `${import.meta.env.VITE_API_URL}/destinations`;
function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline, isServerOnline } = useNetworkStatus();
  const isFullyOnline = isOnline && isServerOnline;

  useEffect(() => {
    const handleNetworkChange = async () => {
      if (isFullyOnline) {
        try {
          setIsSyncing(true);
          await offlineService.processQueue();
          await fetchDestinations();
        } catch (error) {
          console.error("Sync error:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    handleNetworkChange();
  }, [isFullyOnline]);

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(API_URL);
      setDestinations(res.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const deleteDestination = (id: number) => {
    if (isFullyOnline) {
      axios
        .delete(`${API_URL}/${id}`)
        .then(() => setDestinations((prev) => prev.filter((d) => d.id !== id)))
        .catch(console.error);
    } else {
      offlineService.addToQueue({
        type: "DELETE",
        payload: { id },
      });
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const createDestination = (newDestination: Omit<Destination, "id">) => {
    if (isFullyOnline) {
      axios
        .post(API_URL, newDestination)
        .then((res) => setDestinations((prev) => [...prev, res.data]))
        .catch((err) => {
          console.error("Error saving destination:", err);
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
      {isSyncing && (
        <div className="sync-banner">Syncing offline changes...</div>
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
          element={<AddDestination createDestination={createDestination} />}
        />
        <Route
          path="/attraction/:name"
          element={<AttractionDetails destinations={destinations} />}
        />
        <Route
          path="/charts"
          element={<ChartsPage destinations={destinations} />}
        />
      </Routes>
    </div>
  );
}

export default App;
