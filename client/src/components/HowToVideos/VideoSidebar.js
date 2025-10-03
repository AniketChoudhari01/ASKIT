import { useState, useEffect } from "react";
import axios from "axios";
const VideoSidebar = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const queriesPerPage = 5;
  const totalPages = Math.ceil(totalItems / queriesPerPage);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/videos/getVideos?page=${currentPage}&limit=${queriesPerPage}`
        );
        setVideos(res.data.data);
        setTotalItems(res.data.totalItems);
      } catch (error) {
        console.error("error fetching pagination videos", error);
      }
    };
    fetchVideos();
  }, [currentPage]);
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
    <div>
      {videos.map((vid) => (
        <div
          key={vid._id}
          className="video-sidebar-container"
          onClick={() => onVideoSelect(vid)}
        >
          <img
            src={`https://img.youtube.com/vi/${vid.videoId}/0.jpg`}
            alt={vid.title}
            className="sidebar-thumbnail"
          />
          <div className="text-sm">{vid.title}</div>
        </div>
      ))}
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
  );
};

export default VideoSidebar;
