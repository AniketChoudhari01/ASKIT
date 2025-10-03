import { useState, useRef, useEffect } from "react";
import { IoIosMore } from "react-icons/io";
import "./videos.css";
import { toast } from "react-toastify";
function CommentActions({
  isOwner,
  onEdit,
  onDelete,
  onReport,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="report-wrapper">
      <button
        ref={triggerRef}
        className="report-action"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IoIosMore title="More actions" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="report-menu"
          role="menu"
          onClick={(e) => e.stopPropagation()} // keep menu open until action chosen
        >
          {isOwner ? (
            <>
              <button
                className="report-menu-item"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onEdit?.();
                }}
              >
                Edit
              </button>
              <button
                className="report-menu-item"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onDelete?.();
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <button
              className="report-menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onReport?.();
              }}
            >
              Report
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentActions;
