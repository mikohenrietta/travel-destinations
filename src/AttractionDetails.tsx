import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "./styles/AttractionDetails.css";

interface Destination {
  name: string;
  country: string;
  description: string;
  address: string;
  picture: string;
  continent: string;
  rating: number;
}

interface AttractionDetailsProps {
  destinations: Destination[];
}

const AttractionDetails: React.FC<AttractionDetailsProps> = ({
  destinations,
}) => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // ✅ FIXED: Added missing navigate function

  const description = searchParams.get("desc");
  const address = searchParams.get("addr");
  const image = searchParams.get("img");
  const rating = searchParams.get("rating");

  const currentIndex = destinations.findIndex(
    (destination) => destination.name === name
  );

  if (currentIndex === -1) {
    return <h2>Attraction not found</h2>;
  }

  const prevAttraction =
    currentIndex > 0 ? destinations[currentIndex - 1] : null;
  const nextAttraction =
    currentIndex < destinations.length - 1
      ? destinations[currentIndex + 1]
      : null;

  return (
    <div className="attraction-details">
      <h2>The {name}</h2>
      <div className="image-holder">
        <img
          src={`/${image}` || destinations[currentIndex].picture}
          alt={name}
        />
      </div>
      <p>{description || destinations[currentIndex].description}</p>
      <p>Rating: {rating || destinations[currentIndex].rating}</p>
      <p>
        <span className="material-icons">location_on</span>
        {address || destinations[currentIndex].address}
      </p>

      <div className="pagination">
        {prevAttraction && (
          <button
            onClick={() => navigate(`/attraction/${prevAttraction.name}`)}
            data-testid="prev-button"
          >
            <span className="material-icons">arrow_back_ios</span>
          </button>
        )}
        {nextAttraction && (
          <button
            onClick={() => navigate(`/attraction/${nextAttraction.name}`)}
            data-testid="next-button"
          >
            <span className="material-icons">arrow_forward_ios</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AttractionDetails;
