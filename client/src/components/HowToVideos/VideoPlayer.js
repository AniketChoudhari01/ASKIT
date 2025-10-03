import "./videos.css";
import { CiHeart } from "react-icons/ci";
import { MdIosShare } from "react-icons/md";

const VideoPlayer = ({ video }) => {
  return (
    <div className="video-play-container">
      <iframe
        // width="100%"
        // height="500"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title={video.title}
        allowFullScreen
      ></iframe>
      <h3>{video.title}</h3>
      <div className="video-btn-container">
        <button>
          <span>
            <CiHeart className="btn-icon" /> 0
          </span>
        </button>
        <button>
          <span>
            <MdIosShare className="btn-icon" />
            Share
          </span>
        </button>
      </div>
      <p className="text-sm text-gray-600">{video.description}</p>
    </div>
  );
};

export default VideoPlayer;
