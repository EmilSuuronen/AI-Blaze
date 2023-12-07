import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./HeaderBar.css";
import { BiLogIn } from "react-icons/bi";
import { UserAuth } from "../../context/AuthContext";
import { FaBars } from "react-icons/fa"; // Import the icon

const HeaderBar = () => {
  const location = useLocation();
  const locationName = location.pathname;
  const { logOut } = UserAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logOut();
      console.log("User signed out");
    } catch (error) {
      console.log(error);
    }
  };

  const getHeaderText = (pathname) => {
    let headerText = "";

    switch (pathname) {
      case "/":
        headerText = "";
        break;

      case "/mainscreen":
        headerText = "Home";
        break;
      case "/loginView":
        headerText = "Login";
        break;
      case "/generate":
        headerText = "Generate";
        break;
      case "/createNewProject":
        headerText = "Create New Project";
        break;
      case "/labelEditor":
        headerText = "Label Editor";
        break;
      case "/newProjectView":
        headerText = "New Project";
        break;
      case "/editView":
        headerText = "Edit Project";
        break;
      case "/galleryView":
        headerText = "Gallery";
        break;
      default:
        headerText = ""; // This is a fallback for unrecognized paths
    }
    return headerText;
  };

  return (
    <header>
      <div className="header-item-main">
        <Link to="/mainscreen" className="header-item-main-link">
          AI-Blaze
        </Link>
      </div>
      <div className="header-item">{getHeaderText(locationName)}</div>
      <div className="header-dropdown">
        <button
          className="dropdown-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaBars /> {/* Icon here */}
        </button>
        {dropdownOpen && (
          <div className="dropdown-content">
            <Link to="/galleryView">Gallery</Link>
            <Link to="/createNewProject">Create New Project</Link>
            <button onClick={handleSignOut}>
              Signout <BiLogIn />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;