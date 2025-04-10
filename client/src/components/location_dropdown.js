import React, { useState, useRef, useEffect, useContext } from "react";
import "./LocationDropdown.css"; 
import { UserContext } from "../context/UserContext";

const LocationDropdown = ({ selectedLocation, setSelectedLocation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useContext(UserContext);
  const savedLocations =
    user?.addresses?.map((addr) => ({
      name: addr.address, // Store the address name
      lat: addr.location?.coordinates[1], // Latitude (MongoDB stores [lon, lat])
      lon: addr.location?.coordinates[0], // Longitude
    })) || [];
  const [searchQuery, setSearchQuery] = useState(selectedLocation || ""); // Use selectedLocation as default
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    console.log("saved", savedLocations);
    // console.log(user);
    if (searchQuery.length > 2) {
      fetchAutocompleteResults(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchAutocompleteResults = async (query) => {
    const API_KEY = "pk.954f6caba272da7bd96c00235c5ede8d";

    if (!API_KEY) {
      console.error("API Key is missing. Check your .env file.");
      return;
    }

    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&countrycodes=in&limit=5&format=json`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setSuggestions(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsHovering(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectLocation = (location) => {
    // console.log("user selected location", location);
    if (!location || !location.lat || !location.lon) {
      console.error("Invalid location data:", location);
      return;
    }
    setSelectedLocation({
      name: location.name || "Unknown",
      lat: location.lat || "N/A",
      lon: location.lon || "N/A",
    });
    setSearchQuery(location.name);
    setIsDropdownOpen(false);
    setIsHovering(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    //  console.log("Selected suggestion object:", suggestion);
    setSelectedLocation({
      name: suggestion.display_name || suggestion.name || "Unknown",
      lat: suggestion.lat || "N/A",
      lon: suggestion.lon || "N/A",
    });
    //  console.log("Location from dropdown", suggestion.lat, suggestion.lon);
    setSearchQuery(suggestion.display_name || "");
    setSuggestions([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedLocation(""); // Clear the selected location in the parent
    setSuggestions([]);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        className="dropdown-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {searchQuery || "Select Location"}{" "}
        <span>{isDropdownOpen ? "▲" : "▼"}</span>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div
            className="saved-locations"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Your Address ›
          </div>

          {isHovering && savedLocations.length > 0 && (
            <div
              className="saved-locations-menu"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="saved-title">Use your Default Address</div>
              {savedLocations.map((location, index) => (
                <div
                  key={index}
                  className="saved-item"
                  onClick={() => handleSelectLocation(location)}
                >
                  {location.name}
                </div>
              ))}
            </div>
          )}

          <div className="search-container">
            <input
              type="text"
              placeholder="Search for an address..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={clearSearch}>
                ❌
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(item)}>
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
