import { Link } from "react-router-dom";
import "./styles/Header.css";

function Header() {
  return (
    <div className="header-class">
      <header className="navbar">
        <p>TravelDestinations</p>

        <nav>
          <Link to="/">
            <span className="material-icons">home</span>
            Start
          </Link>
          <Link to="/seeall">
            <span className="material-icons">apps</span>See All
          </Link>
          <Link to="/add">
            <span className="material-icons">add</span>Add
          </Link>
          <Link to="/charts">
            <span className="material-icons">equalizer</span>Charts
          </Link>
        </nav>
      </header>
    </div>
  );
}

export default Header;
