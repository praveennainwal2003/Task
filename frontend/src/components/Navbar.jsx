import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/">Home</Link>

      {role === "academy" && <Link to="/upload">Upload PDF</Link>}
      {role === "student" && <Link to="/search">Search PDFs</Link>}

      {token && <button onClick={logout}>Logout</button>}
    </nav>
  );
};

export default Navbar;
