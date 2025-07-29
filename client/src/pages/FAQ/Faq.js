import React, { useState, useEffect, useRef } from "react";
import "./Faq.css";
import faqBg from "../../Assets/verify/faq-bg.png";
import "../Filter/Search-Filter.css";
import clientCard from "../../Assets/verify/faq-client-card.png";
import serviceCard from "../../Assets/verify/faq-service-card.png";
import LocationDropdown from "../../components/location_dropdown";
import FAQAccordion from "../../components/FAQAccordion/FAQAccordion";
import queryImg from "../../Assets/verify/faq-user-query.png";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
// import FAQDisplay from "../../components/FAQDisplay/FAQDisplay";
function Faq() {
  const faqSectionRef = useRef(null);
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
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [userType, search, selectedLocation, currentPage]);

  const applyFilters = () => {
    setCurrentPage(1);
  };
  const smoothScrollTo = (targetY, duration = 800) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };
  const handleCardClick = (type) => {
    setUserType(type);
    const targetY = faqSectionRef.current.offsetTop - 50; // small offset for spacing
    smoothScrollTo(targetY, 800); // ~natural scroll speed
  };
  const indexOfLastCard = currentPage * queriesPerPage;
  const indexOfFirstCard = indexOfLastCard - queriesPerPage;
  const currentCards = filteredQueryData;

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
  /* zod schema */
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    question: z.string().min(1, "Please enter your question"),
    userType: z.enum(["provider", "seeker"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
    userType: "",
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Real-time validation
  useEffect(() => {
    if (!formSubmitted) return;
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
    } else {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    }
  }, [formData, formSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Clear that field's error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const reponse = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/faqs/support`,
        formData
      );
      setFormData({
        name: "",
        email: "",
        question: "",
        userType: "",
      });
      setErrors({});
      setFormSubmitted(false);
      toast.success("Thanks! Your question has been submitted.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <div className="container">
        <div className="img-wrapper">
          <img src={faqBg} alt="frequently asked question image" />
        </div>
        <div className="query-card">
          <div className="card" onClick={() => handleCardClick("seeker")}>
            <img src={clientCard} alt="query card" />
            <h3>Service seeker</h3>
          </div>
          <div className="card" onClick={() => handleCardClick("provider")}>
            <img src={serviceCard} alt="query card" />
            <h3>Service provider</h3>
          </div>
          <div className="card" onClick={() => handleCardClick("two-way")}>
            <img src={serviceCard} alt="query card" />
            <h3>Two way interaction</h3>
          </div>
        </div>
      </div>
      {/* /* section for search query */}
      <div ref={faqSectionRef} className="page-wrapper">
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

          <div className="user-faq-results">
            {currentCards.length > 0 ? (
              <FAQAccordion faqs={currentCards} />
            ) : (
              <p className="no-results">
                We couldn’t find any results matching your search. Please try
                different keywords or locations.
              </p>
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
                disabled={
                  currentPage === Math.ceil(totalItems / queriesPerPage)
                }
                onClick={goToNextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* section for user query */}
      <div className="form-wrapper">
        <div className="form-container">
          <div className="left-side">
            <h1>Ask a question</h1>
            <img src={queryImg} alt="ask a question" />
          </div>
          <div className="right-side">
            <form className="ask-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-group full">
                <label>Your question</label>
                <textarea
                  name="question"
                  rows="4"
                  value={formData.question}
                  onChange={handleChange}
                />
                {errors.question && (
                  <span className="error">{errors.question}</span>
                )}
              </div>

              <div className="form-group full role-select">
                <label>I am a</label>
                <div className="radio-labels">
                  <label>
                    <input
                      type="radio"
                      name="userType"
                      value="provider"
                      checked={formData.userType === "provider"}
                      onChange={handleChange}
                    />
                    Service provider
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="userType"
                      value="seeker"
                      checked={formData.userType === "seeker"}
                      onChange={handleChange}
                    />
                    Service seeker
                  </label>
                </div>
                {errors.userType && (
                  <span className="error">{errors.userType}</span>
                )}
              </div>

              <button type="submit" className="ask-btn">
                Ask IT
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faq;
