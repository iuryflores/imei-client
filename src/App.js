import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import api from "./utils/api.utils";

import loadingGif from "./imgs/loading-state.gif";

import AppNavbar from "./components/AppNavbar";
import { HomePage } from "./views/HomePage";
import { LoginPage } from "./views/LoginPage";
import { Clientes } from "./views/Clientes.js";
import { Fornecedores } from "./views/Fornecedores";
import { Compras } from "./views/Compras";
import { Vendas } from "./views/Vendas";
import { Auditoria } from "./views/Auditoria";
import AddVenda from "./views/AddVenda";
import Produtos from "./views/Produtos";
import Caixas from "./views/Caixas";
import AddCompra from "./views/AddCompra";
import User from "./views/User";
import ViewUser from "./views/ViewUser";
import AddCaixa from "./views/AddCaixa";
import ViewCaixa from "./views/ViewCaixa";

function App() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userToken = sessionStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(!!userToken);

  const navigate = useNavigate();

  const handleLogin = (username) => {
    setLoggedIn(true);
    navigate("/");
  };
  const handleSignup = (username, password, cpf, email) => {
    setLoggedIn(false);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/login");
  };

  const userId = sessionStorage.getItem("userId");

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  //formatar data
  const formatarData = (dataParaFormatar) => {
    return new Date(dataParaFormatar).toLocaleDateString("pt-br", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };
  //formatar data e hora
  const formatarDataEHora = (dataParaFormatar) => {
    return new Date(dataParaFormatar).toLocaleDateString("pt-br", {
      day: "numeric",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });
  };

  const [userData, setUserData] = useState("");

  useEffect(() => {
    if (userId) {
      const getUser = async (userId) => {
        try {
          const data = await api.getUserNav(userId);
          setUserData(data);
        } catch (error) {
          console.log(error);
        }
      };
      getUser(userId);
    }
  }, [userId]);

  const [isAdmin, setIsAdmin] = useState(
    () => userData && userData.admin === true
  );

  useEffect(() => {
    if (userData && userData.admin !== undefined) {
      setIsAdmin(userData.admin === true);
    }
  }, [userData]);

  return (
    <div>
      {loggedIn ? (
        <AppNavbar onLogout={logout} isAdmin={isAdmin} userData={userData} />
      ) : null}

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
                  userId={userId}
                />
              }
            />

            <Route
              path="/compras/"
              element={
                <Compras
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              }
            />
            <Route
              path="/vendas/"
              element={
                <Vendas
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  openModal={openModal}
                  closeModal={closeModal}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/vendas/cadastrando/"
              element={
                <AddVenda
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/compras/cadastrando/"
              element={
                <AddCompra
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/clientes/"
              element={
                <Clientes
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              }
            />

            <Route
              path="/estoque/"
              element={
                <Produtos
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              }
            />
            <Route
              path="/fornecedores/"
              element={
                <Fornecedores
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              }
            />
            <Route
              path="/auditoria/"
              element={
                <Auditoria
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/usuarios/"
              element={
                <User
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/usuarios/:id"
              element={
                <ViewUser
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                />
              }
            />
            <Route
              path="/caixas/"
              element={
                <Caixas
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/caixas/cadastrando/"
              element={
                <AddCaixa
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
                />
              }
            />
            <Route
              path="/caixas/:id/"
              element={
                <ViewCaixa
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userId={userId}
                  formatarData={formatarData}
                  formatarDataEHora={formatarDataEHora}
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
