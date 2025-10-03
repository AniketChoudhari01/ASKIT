import { useState, useRef, useEffect } from "react";
import { RiReplyLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import "./videos.css";
import { toast } from "react-toastify";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import { IoIosMore } from "react-icons/io";
import CommentActions from "./CommentActions";
import LoadOverlay from "../../components/Loading/LoadingOverlay";

const CommentItem = ({ comment, onReply, currentUser, fetchComments }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadMessage, setLoadMessage] = useState("");
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLikedByUser, setIsLikedByUser] = useState(
    comment.likedBy?.includes(currentUser?._id)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  //report states
  const [showReport, setShowReport] = useState(false);
  // const [isRepliedByUser, setIsRepliedByUser] = useState(
  //   comment.commentedBy?.toString === currentUser?._id
  // );
  const isOwner =
    comment.commentedBy?.toString() === currentUser?._id?.toString();

  // console.log("comment in comment item", comment);
  // console.log("current user in comment item", currentUser);
  // console.log("is own ", isOwner);
  const likedBy = comment.likedBy || [];

  const updateMessage = (message) => {
    setLoadMessage(message);
  };
  const handleLike = async () => {
    if (!currentUser || !currentUser._id) {
      toast.warn("Please login to like comments.");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);
    // console.log("under like function");
    try {
      if (isLikedByUser) {
        setLikes((prev) => Math.max(prev - 1, 0));
        setIsLikedByUser(false); // Update local state immediately
        // console.log("unliking comment", comment._id, currentUser._id);
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/comments/${comment._id}/unlike`,
          { userId: currentUser._id }
        );
        toast.info("Unliked the comment");
      } else {
        setLikes((prev) => prev + 1);
        setIsLikedByUser(true); // Update local state immediately
        // console.log("liking comment", comment._id, currentUser._id);
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/comments/${comment._id}/like`,
          { userId: currentUser._id }
        );
        toast.success("Liked the comment");
      }
    } catch (error) {
      toast.error("Failed to update like status");
      // console.log("like error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    let finalReplyText = "";
    if (comment._id) {
      finalReplyText = `@${comment.user || "user"}: ${replyText.trim()}`;
    } else {
      finalReplyText = replyText.trim();
    }
    // console.log("final reply text", finalReplyText);
    const newReply = {
      parentId: comment._id,
      videoId: comment.videoId,
      text: finalReplyText,
      user: currentUser.name || "Anonymous",
      commentedBy: currentUser._id,
    };

    onReply(newReply);
    setReplyText("");
    setShowReplyBox(false);
  };
  const openEdit = (comment) => {
    if (!currentUser || !currentUser._id || !comment._id) {
      return toast.warn("Comment not found or user not logged in.");
    }
    setIsEditing(true);
    setReplyText(comment.text);
    setEditingCommentId(comment._id);
    // console.log("comment id", comment._id);
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setReplyText("");
    setEditingCommentId(null);
    setShowReplyBox(false);
  };
  const handleSave = async (commentId) => {
    if (commentId !== editingCommentId) {
      return toast.warn("Comment not found! Please refresh the page.");
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/comments/${commentId}`,
        {
          text: replyText,
          userId: currentUser._id,
          commentId: commentId,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Comment updated successfully");
        fetchComments();
      }
    } catch (error) {
      // console.log(error, "error in upadating comment");
      return toast.error("Failed to update comment");
    } finally {
      setReplyText("");
      setIsEditing(false);
      setEditingCommentId(null);
    }
  };
  const deleteComment = async (commentId) => {
    if (!currentUser || !currentUser._id) {
      return toast.warn("Please login to delete comments.");
    }
    setIsDeleting(true);
    try {
      // console.log("deleting comment", commentId, currentUser._id);
      setShowReport(false);
      const res = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/comments/${commentId}`,
        {
          data: { userId: currentUser._id },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        await fetchComments();
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      // console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };
  const openReport = (commentId) => {
    if (!currentUser || !currentUser._id) {
      toast.warn("Please login to report comments.");
      return;
    } else {
      setShowReport(true);
      // console.log("reporting comment", commentId, currentUser._id);
      toast.info("Reporting comment is not implemented yet.");
      // Implement report logic here
    }
  };

  return (
    <div className="comment-item">
      {isDeleting && <LoadOverlay message="Deleting comment..." />}
      <div className="comment-header">
        <span className="comment-username">
          {isOwner ? "You" : comment.user}
        </span>
      </div>
      {editingCommentId === comment._id && isEditing ? (
        <input
          type="text"
          className="comment-edit-input"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          maxLength={300}
        />
      ) : (
        <div className="comment-text">{comment.text}</div>
      )}
      {/* show edit actions btn  */}
      {editingCommentId === comment._id && isEditing && (
        <div className="comment-edit-btns">
          <button onClick={cancelEdit} className="comment-edit-cancel-btn">
            Cancel
          </button>
          <button
            className="save-comment"
            onClick={() => handleSave(comment._id)}
            disabled={isProcessing}
          >
            Save
          </button>
        </div>
      )}

      <div className="comment-actions">
        <button className="comment-like-btn" onClick={handleLike}>
          <span>
            {isLikedByUser ? (
              <FcLike className={`icon `} />
            ) : (
              <CiHeart className={`icon `} />
            )}
            {likes}
          </span>
        </button>
        {!isOwner && (
          <button
            className="comment-reply-toggle-btn"
            onClick={() => setShowReplyBox(!showReplyBox)}
          >
            <RiReplyLine className="icon" /> Reply
          </button>
        )}

        {comment.replies?.length > 0 && (
          <button
            className="comment-show-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? "Hide replies"
              : `Show replies (${comment.replies.length})`}
          </button>
        )}
        <CommentActions
          isOwner={isOwner}
          onEdit={() => openEdit(comment)}
          onDelete={() => deleteComment(comment._id)}
          onReport={() => openReport(comment._id)}
        />
      </div>

      {showReplyBox && (
        <div className="comment-reply-box">
          <input
            type="text"
            className="reply-input"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            // initialValue={`Reply to @${comment.user}`}
            placeholder="write your reply here... upto 300 characters"
            max={100}
          />
          <small className="text-xs text-gray-500 my-1 block">
            Be respectful and concise.
          </small>
          <div className="reply-actions">
            <button className="btn-reply" onClick={handleReply}>
              Reply
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowReplyBox(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showReplies && comment.replies?.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              currentUser={currentUser}
              fetchComments={fetchComments}
            />
          ))}
          <hr />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
