import { useState } from "react";
import "./ReviewCarousel.css";

const ReviewCarousel = () => {
  const reviews = [
    {
      title: "Great Work",
      text: `"I was able to find a reliable service provider in minutes. I highly recommend ASKIT to anyone who needs a service."`,
      user: "John Doe",
      username: "@JohnDoe4567",
      img: "review-image1.png",
    },
    {
      title: "Amazing Experience",
      text: `"The platform is easy to use and saved me a lot of time. Great job ASKIT!"`,
      user: "Jane Smith",
      username: "@Jane123",
      img: "home-review-image1.png",
    },
    {
      title: "Very Helpful",
      text: `"ASKIT helped me connect with the right people quickly. Loved it!"`,
      user: "Mike",
      username: "@Mike890",
      img: "review-image1.png",
    },
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div className="review-carousel-container">
      {/* Cards Wrapper */}
      <div
        className="review-carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {reviews.map((r, i) => (
          <div className="review-card" key={i}>
            <div className="review-content">
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
            <div className="review-user">
              <img src={r.img} alt={r.user} />
              <div>
                <p>{r.user}</p>
                <small>{r.username}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="review-nav">
        <button onClick={prev}>⬅️</button>
        <button onClick={next}>➡️</button>
      </div>

      {/* Dots */}
      <div className="review-dots">
        {reviews.map((_, i) => (
          <span
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
