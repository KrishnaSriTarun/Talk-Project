import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Authmodals() {
      const [isLoginOpen, setLoginOpen] = useState(false);
      const [isSignupOpen, setSignupOpen] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const navigate = useNavigate();

      const loginFormRef = useRef(null);
      const signupFormRef = useRef(null);

      // Close modals when clicking outside
      const handleClose = (event, modalsType) => {
            if (event.target.classList.contains("modals")) {
                  if (modalsType === "login") setLoginOpen(false);
                  if (modalsType === "signup") setSignupOpen(false);
            }
      };

      const handleLogin = async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);

            const formData = new FormData(loginFormRef.current);
            const data = {
                  username: formData.get("username"),
                  password: formData.get("password"),
            };

            try {
                  const response = await fetch("https://talk-project.onrender.com/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                        credentials: "include",
                  });

                  if (response.ok) {
                        const result = await response.json();
                        localStorage.setItem("authToken", result.token);
                        navigate("/talk");
                  } else {
                        setError("Invalid username or password.");
                  }
            } catch (error) {
                  console.error("Login error:", error);
                  setError("Something went wrong. Try again later.");
            } finally {
                  setLoading(false);
            }
      };

      const handleSignup = async (event) => {
            event.preventDefault();
            setError(null);

            const formData = new FormData(signupFormRef.current);

            try {
                  const response = await fetch("https://talk-project.onrender.com/signup", {
                        method: "POST",
                        body: formData,
                  });

                  if (response.ok) {
                        alert("Account created! Redirecting...");
                        setSignupOpen(false);
                        navigate("/talk");
                  } else {
                        setError("Signup failed. Try again.");
                  }
            } catch (error) {
                  console.error("Signup error:", error);
                  setError("Something went wrong. Try again later.");
            }
      };

      return (
            <div className="container text-center mt-5">
                  <div className="mid">
                        <h2 className="Head">Login Form</h2>
                        <button
                              onClick={() => setLoginOpen(true)}
                              className="btn btn-primary"
                              style={{ width: "auto" }}
                        >
                              Login
                        </button>
                  </div>

                  {/* Login modals */}
                  {isLoginOpen && (
                        <div id="id01" className={`modals ${isLoginOpen ? "show" : ""}`} onClick={(e) => handleClose(e, "login")}>
                              <form className="modals-content animate" ref={loginFormRef} onSubmit={handleLogin}>
                                    <div className="imgcontainer">
                                          {/* <button type="button" className="close" onClick={() => setLoginOpen(false)}>
                                                &times;
                                          </button> */}
                                          <div className="icon-container">
                                                <div className="microphone-icon">
                                                      <div className="icon-text">T</div>
                                                </div>
                                          </div>
                                    </div>

                                    <div className="container">
                                          {error && <p className="error-message">{error}</p>}
                                          <label htmlFor="uname"><b>Username</b></label>
                                          <input type="text" placeholder="Enter Username" name="username" required />

                                          <label htmlFor="psw"><b>Password</b></label>
                                          <input type="password" placeholder="Enter Password" name="password" required />

                                          <button type="submit" disabled={loading}>
                                                {loading ? "Logging in..." : "Login"}
                                          </button>

                                          <label>
                                                <input type="checkbox" name="remember" /> Remember me
                                          </label>
                                    </div>

                                    <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
                                          <button type="button" className="cancelbtn" onClick={() => setLoginOpen(false)}>
                                                Cancel
                                          </button>
                                          <span className="psw">
                                                Forgot <a href="#">password?</a>
                                          </span>
                                          <span className="psw">
                                                No account?{" "}
                                                <a href="#" onClick={() => { setLoginOpen(false); setSignupOpen(true); }}>
                                                      Create an account
                                                </a>
                                          </span>
                                    </div>
                              </form>
                        </div>
                  )}

                  {/* Signup modals */}
                  {isSignupOpen && (
                        <div id="id02" className={`modals ${isSignupOpen ? "show" : ""}`} onClick={(e) => handleClose(e, "signup")}>
                              <form className="modals-content animate" ref={signupFormRef} onSubmit={handleSignup}>
                                    <div className="imgcontainer">
                                          <button type="button" className="close" onClick={() => setSignupOpen(false)}>
                                                &times;
                                          </button>
                                    </div>

                                    <div className="container">
                                          {error && <p className="error-message">{error}</p>}
                                          <label htmlFor="email"><b>Email</b></label>
                                          <input type="text" placeholder="Enter Email" name="email" required />

                                          <label htmlFor="uname"><b>Username</b></label>
                                          <input type="text" placeholder="Enter Username" name="username" required />

                                          <label htmlFor="profile"><b>Profile:</b></label>
                                          <input type="file" className="pro" id="profile" name="profile" required />

                                          <label htmlFor="psw"><b>Password</b></label>
                                          <input type="password" placeholder="Enter Password" name="password" required />

                                          <button type="submit">Create Account</button>
                                    </div>

                                    <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
                                          <button type="button" className="cancelbtn" onClick={() => setSignupOpen(false)}>
                                                Cancel
                                          </button>
                                    </div>
                              </form>
                        </div>
                  )}
            </div>
      );
}
