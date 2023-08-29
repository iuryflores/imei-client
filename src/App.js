import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";

import loadingGif from "./imgs/loading-state.gif";

import Navbar from "./components/Navbar";
import HomePage from "./views/HomePage";
import { LoginPage } from "./views/LoginPage";

function App() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = sessionStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(!!userId);

  const navigate = useNavigate();

  const handleLogin = (username) => {
    // Aqui você pode realizar a autenticação adequada e definir o estado loggedIn
    setLoggedIn(true);
    navigate("/");
  };
  const handleSignup = (username, password, departament, house) => {
    // Aqui você pode adicionar lógica para registrar um novo usuário
    // e, em seguida, automaticamente fazer login com as credenciais fornecidas
    setLoggedIn(false);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      {loggedIn ? <Navbar onLogout={logout} /> : null}

      <Routes>
        {loggedIn ? (
          <>
            <Route
              path="/"
              element={
                <HomePage
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                />
              }
            />
          </>
        ) : (
          <>
            <Route
              path="*"
              element={
                <LoginPage
                  handleLogin={handleLogin}
                  handleSignup={handleSignup}
                  message={message}
                  setMessage={setMessage}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  handleLogin={handleLogin}
                  handleSignup={handleSignup}
                  message={message}
                  setMessage={setMessage}
                />
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
