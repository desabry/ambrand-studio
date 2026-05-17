"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Login failed: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Login failed: Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          options: { data: { full_name: name } },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Signup failed: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Signup failed: Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function switchForm() {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div className="auth-modal-content">
        <h2
          style={{
            color: "#fff",
            margin: "0 0 30px",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {isLogin ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input
                id="signupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                id="signupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
        )}

        <div className="auth-switch">
          <p>
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); switchForm(); }}>
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); switchForm(); }}>
                  Login
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
