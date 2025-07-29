import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";
import "./videos.css";
import { buildCommentTree } from "../../Utils/buildCommentTree";
import { useUser } from "../../context/UserContext";

const CommentSection = ({ videoId }) => {
  const { user, isAuthenticated } = useUser();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const textRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  // console.log("user in comment section", user);
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [text]);

  const fetchComments = async () => {
    try {
      // console.log("in UI videoId", videoId);
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/comments/${videoId}`
      );
      const nestedComments = buildCommentTree(res.data);
      setComments(nestedComments);
    } catch (err) {
      console.error(
        "🔥 ERROR in fetchComments",
        err.response?.data || err.message
      );
    }
  };

  const handleSubmit = async () => {
    // console.log("inside the comment call", videoId, text, user);
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/comments`, {
      videoId,
      text,
      user: user.name || "Anonymous",
      commentedBy: user._id,
    });
    setText("");
    fetchComments();
  };
  const handleReplySubmit = async (reply) => {
    try {
      console.log("reply in section ", reply);
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/comments/reply`,
        reply
      );
      fetchComments(); // refresh all comments after posting reply
    } catch (err) {
      console.error("❌ Failed to reply", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (videoId) {
      // console.log("Fetching comments for videoId:", videoId);
      fetchComments();
    } else {
      // console.warn("No videoId provided to CommentSection");
    }
  }, [videoId]);

  return (
    <div className="comments-section">
      <h3>Got a doubt? Ask it below!</h3>

      <div className="comment-input-container">
        <img src="/avatar.png" alt="avatar" className="avatar" />
        <div className="input-wrapper">
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setShowButtons(e.target.value.trim().length > 0);
            }}
            className="comment-textarea"
            placeholder="Add your doubts here"
            rows={1}
          ></textarea>

          {showButtons && (
            <div className="comment-actions">
              <button
                className="btn-outline"
                onClick={() => {
                  setText("");
                  setShowButtons(false);
                }}
              >
                Cancel
              </button>
              <button className="comment-btn" onClick={handleSubmit}>
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReply={handleReplySubmit}
            videoId={videoId}
            currentUser={user}
            fetchComments={fetchComments}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
