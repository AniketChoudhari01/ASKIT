import React, { useState, useRef, useEffect } from "react";
import "./LocationDropdown.css";
import { useUser } from "../context/UserContext";
import { FaSearchLocation } from "react-icons/fa";

const LocationDropdown = ({ onLocationSelect, defaultLocation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useUser();

  // Use saved location from user context if available
  const savedLocation = user?.address
    ? {
        name: user.address.address,
        coordinates: [
          user.address.location?.coordinates[0], // lon
          user.address.location?.coordinates[1], // lat
        ],
      }
    : null;

  const [searchQuery, setSearchQuery] = useState(defaultLocation || "");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch autocomplete suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchAutocompleteResults(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 500); // wait 500ms after user stops typing

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchAutocompleteResults = async (query) => {
    const API_KEY = process.env.REACT_APP_LOCATIONIQ_API_KEY;
    // if (!API_KEY) {
    //   // console.error("API Key is missing. Check your .env file.");
    //   return;
    // }
    // console.log("new api key is ", API_KEY);
    try {
      const response = await fetch(
        // `https://us1.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&countrycodes=in&limit=5&format=json`
        `https://eu1.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&countrycodes=in&limit=5&format=json`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ When user selects a location (saved or searched)
  const selectLocation = (locationObj) => {
    if (!locationObj?.coordinates) {
      console.error("Invalid location:", locationObj);
      return;
    }
    setSearchQuery(locationObj.name);
    setIsDropdownOpen(false);
    setSuggestions([]);
    onLocationSelect(locationObj); // 🔥 Send location object to parent
  };

  // Handle selecting saved address
  const handleSelectSaved = () =>
    savedLocation && selectLocation(savedLocation);

  // Handle selecting from suggestions
  const handleSelectSuggestion = (sug) => {
    const locationData = {
      name: sug.display_name,
      coordinates: [parseFloat(sug.lon), parseFloat(sug.lat)],
    };
    selectLocation(locationData);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    onLocationSelect(null); // clear in parent too
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder="🔍 Search location..."
        className="search-location-input"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsDropdownOpen(true);
        }}
        onClick={() => setIsDropdownOpen(true)}
      />
      {isDropdownOpen && (
        <div className="dropdown-menu">
          {savedLocation && (
            <div className="saved-locations" onClick={handleSelectSaved}>
              Use your saved address ›
            </div>
          )}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, idx) => (
                <li key={idx} onClick={() => handleSelectSuggestion(item)}>
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
