import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

    
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate(res.data.role === "academy" ? "/upload" : "/search");
    } catch (err) {
     
      alert(err.response?.data?.msg || "Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={submit}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
