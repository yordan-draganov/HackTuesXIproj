import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "../css/Signup.css";
import { auth, db } from "../../firebase";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const hashedPassword = await bcrypt.hash(password, 10);

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        password: hashedPassword,
        investmentAdvice: "",
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;