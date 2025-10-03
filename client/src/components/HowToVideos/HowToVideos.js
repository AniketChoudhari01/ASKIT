import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import VideoSidebar from "./VideoSidebar";
import CommentSection from "./CommentSection";
import "./videos.css";
function HowToVideos() {

  const [videos, setVideos] = useState([]);
  const [currVideo, setCurrVideo] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchVideos();
  }, []);
  const fetchVideos = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/videos/getVideos`
    );
    setVideos(res.data.data);
    setCurrVideo(res.data.data[0]); //loades first video
  };

  const handleSearch = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/videos/getVideos?keyword=${search}`
    );
    setVideos(res.data.data);
    setCurrVideo(res.data.data[0]);
  };
  return (
    <div className="videos-main-container">
      {/* Search + Header */}
      <div className="search-header">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos..."
          className="search-input"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded"
        >
          🔍 <strong>Search</strong>
        </button>
        {/* <div className="ml-4">🌐 English</div> */}
      </div>

      {/* Main Content */}
      <div className="video-container">
        <div className="video-play">
          {currVideo ? (
            <>
              <VideoPlayer video={currVideo} />
              <CommentSection videoId={currVideo?.videoId}/>
            </>
          ) : (
            <div>Video unavailable. Please refresh or try again later.</div>
          )}
        </div>
        <div className="w-onethird">
          <VideoSidebar
            videos={videos}
            onVideoSelect={(vid) => setCurrVideo(vid)}
          />
        </div>
      </div>
    </div>
  );
}

export default HowToVideos;
