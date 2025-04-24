import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="title-container" data-testid="home-container">
      <h1>Best Travel Destinations</h1>
      <Link to="/seeall" className="startbutton">
        Get Started
      </Link>
    </div>
  );
}

export default Home;
