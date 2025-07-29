import "./Error.css";
function Error() {
  return (
    <div className="wrapper">
      <div className="leaf-icon">🍃</div>
      <div className="error-code">404</div>
      <div className="message">Oops! Page not found</div>
      <div className="subtext">
        The page you’re looking for might have been moved or doesn’t exist
        anymore.
      </div>
      <a href="/" className="button">
        Back to Home
      </a>
    </div>
  );
}

export default Error