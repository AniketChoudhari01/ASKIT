import React, { useState, useEffect } from "react";
import "../../pages/FAQ/Faq.css";
import LocationDropdown from "../location_dropdown";
import FAQAccordion from "../FAQAccordion/FAQAccordion";
function FAQDisplay() {
  const [allQueryData, setAllQueryData] = useState([]);
  const [filteredQueryData, setFilteredQueryData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [userType, setUserType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queriesPerPage = 6; // Show 6 query per page
  const handleClearFilters = () => {
    setSearch("");
    setSelectedLocation("");
    // setIsVerified(null);
    setFilteredQueryData(allQueryData);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / queriesPerPage);
  // console.log("backedn url:", process.env.REACT_APP_SERVER_URL);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          keyword: search,
          location: selectedLocation,
          page: currentPage,
          limit: queriesPerPage,
        });

        const endpoint = userType
          ? `/api/faqs/${userType}?${params.toString()}`
          : `/api/faqs?${params.toString()}`;

        const fullUrl = `${process.env.REACT_APP_SERVER_URL}${endpoint}`;
        // console.log("Fetching:", fullUrl);

        const response = await fetch(fullUrl);
        const data = await response.json();
        setFilteredQueryData(data.data);
        setTotalItems(data.total);
      } catch (error) {
        // console.log("Error fetching data", error);
      }
    };

    fetchData();
  }, [userType, search, selectedLocation, currentPage]);

  const applyFilters = () => {
    setCurrentPage(1);
  };

  const indexOfLastCard = currentPage * queriesPerPage;
  const indexOfFirstCard = indexOfLastCard - queriesPerPage;
  const currentCards = filteredQueryData;
  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="user-filter-container">
        <div className="user-container">
          <div className="user-search">
            <div className="user-search-ele1">
              <input
                type="search"
                className="user-search-input"
                placeholder="Search by keyword"
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
        </div>

        <div className="user-results">
          {currentCards.length > 0 ? (
            <FAQAccordion faqs={currentCards} />
          ) : (
            <p className="no-results">No results found for search</p>
          )}
        </div>

        {totalItems > queriesPerPage && (
          <div className="pagination-buttons">
            <button disabled={currentPage === 1} onClick={goToPreviousPage}>
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(totalItems / queriesPerPage)}
            </span>
            <button
              disabled={currentPage === Math.ceil(totalItems / queriesPerPage)}
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQDisplay;
