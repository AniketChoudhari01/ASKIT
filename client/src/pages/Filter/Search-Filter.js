import React, { useState, useEffect } from "react";
import { Card } from "../../components/card";
import "./Search-Filter.css";
import LocationDropdown from "../../components/location_dropdown";
import { useUser } from "../../context/UserContext";
import axios from "axios";
export const Filter = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isVerified, setIsVerified] = useState(null);
  const { user } = useUser();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // Show 6 cards per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_SERVER_URL}/serviceProviders`
        );
        const data = await response.data;
        if (!Array.isArray(data)) {
          // console.error("Unexpected API response:", data);
          return;
        }
        setAllData(data);
        setFilteredData(data);
      } catch (error) {
        // console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const applyFilters = async () => {
    if (!user && selectedLocation) {
      alert("Login or Register to apply location-based filter");
      return;
    }
    if (!search && !selectedLocation && isVerified === null) {
      alert("Please select a filter to apply");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        search: search || "",
        locationCovered: selectedLocation?.name || "",
        lat: selectedLocation?.lat || "",
        lon: selectedLocation?.lon || "",
        isVerified: isVerified !== null ? isVerified : "",
        id: user?._id || "",
      }).toString();

      const response = await axios(
        `${process.env.REACT_APP_SERVER_URL}/queryServiceProviders?${queryParams}`
      );
      const data = await response.data;

      if (!Array.isArray(data)) {
        // console.error("Unexpected API response:", data);
        return;
      }

      setFilteredData(data);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      // console.error("Error fetching filtered data:", error);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedLocation("");
    setIsVerified(null);
    setFilteredData(allData);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  // Calculate current cards to display
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredData.length / cardsPerPage);

  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to the top of the page when changing page
      window.scrollTo({ top: 4, behavior: "smooth" });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to the top of the page when changing page
      window.scrollTo({ top: 4, behavior: "smooth" });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="user-filter-container">
        <div className="user-container">
          <h1 className="user-search-filter">Filters</h1>
          <div className="user-search">
            <div className="user-search-ele1">
              <input
                type="search"
                className="user-search-input"
                placeholder="Search by keyword, Skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <LocationDropdown
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />

            <div className="user-search-ele4">
              <button onClick={applyFilters}>Apply Filter</button>
              <button className="reset-btn" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
          <p className="user-search-text">
            Most searches: Electricians, Masons and Bricklayers...
          </p>
        </div>

        <div className="user-results">
          {currentCards.length > 0 ? (
            currentCards.map((item, index) => <Card key={index} data={item} />)
          ) : (
            <p className="no-results">No results found for search</p>
          )}
        </div>

        {filteredData.length > cardsPerPage && (
          <div className="pagination-buttons">
            <button disabled={currentPage === 1} onClick={goToPreviousPage}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
