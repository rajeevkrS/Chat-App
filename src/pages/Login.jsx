import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //Create user
      await signInWithEmailAndPassword(auth, email, password);

      // After all successfull login, navigate to home page
      navigate("/");
    } catch (error) {
      setError(true);
      console.log("uploading failed");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit-Chat-App</span>
        <span className="title">Login</span>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
          />

          <button>Sign In</button>

          <div className="demoContainer">
            <p>
              <u>Email:</u> test@gmail.com
            </p>
            <p>
              <u>Password:</u> 123456
            </p>
          </div>

          {error && <h3>Something went wrong!</h3>}
        </form>

        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
