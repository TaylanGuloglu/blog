"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/authService";
import loginStyle from "../styles/login.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);

      if (result === "Success") {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={loginStyle.container}>
      <div className={loginStyle.formWrapper}>
        <h2 className={loginStyle.title}>Login</h2>
        <form onSubmit={handleSubmit} className={loginStyle.loginForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={loginStyle.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={loginStyle.input}
          />
          {error && <p className={loginStyle.error}>{error}</p>}
          <button type="submit" className={loginStyle.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
