import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  
  if (!user?.result?._id) return <Redirect to="/" />;

  return children;
};

export default ProtectedRoute;
