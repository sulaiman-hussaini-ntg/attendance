import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    password: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    setIsLoading(true);
    // setError(null);
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "http://localhost:4000/auth",
        { id, password },
        config
      );
      setIsLoading(false);
      localStorage.setItem("employee", JSON.stringify(res.data));
      navigate("/attendance");
    } catch (e) {
      setIsLoading(false);
      setError("Incorrect credentials");
      console.error(e);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back 🖐️</h1>

      <form className="form form-login" onSubmit={onSubmit}>
        <input
          type="number"
          name="id"
          placeholder="Employee ID"
          required
          id="input-id"
          value={id}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          id="input-password"
          value={password}
          onChange={onChange}
        />
        <p className="error">{error}</p>
        <button type="submit" name="submit" value="Login" disabled={isLoading}>
          {isLoading ? "Loading..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default Login;
