import { Link } from "react-router-dom";

interface AttractionProps {
    name: string;
    country: string;
    image: string;
    description: string;
    address: string;
    rating: number;
}

function Attraction({ name, country, image, description, address, rating}: AttractionProps) {
    return (
        <div className="attraction">
            <img src={image} alt={name} className="attr-image" />
            <Link to={`/attraction/${encodeURIComponent(name)}?desc=${encodeURIComponent(description)}&addr=${encodeURIComponent(address)}&img=${encodeURIComponent(image)}&rating=${encodeURIComponent(rating)}`}>
                {name}, {country}
            </Link>
        </div>
    );
}

export default Attraction;
