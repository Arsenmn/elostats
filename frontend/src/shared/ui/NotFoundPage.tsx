import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default NotFoundPage;
