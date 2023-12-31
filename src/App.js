import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import api from "./utils/api.utils";

import loadingGif from "./imgs/loading-state.gif";

import AppNavbar from "./components/AppNavbar";
// import { HomePage } from "./views/HomePage";
import { LoginPage } from "./views/LoginPage";
import { Clientes } from "./views/Clientes.js";
import { Fornecedores } from "./views/Fornecedores";
import { Compras } from "./views/Compras";
import { Vendas } from "./views/Vendas";
import { Auditoria } from "./views/Auditoria";
import Logout from "./views/Logout.js";
import AddVenda from "./views/AddVenda";
// import Produtos from "./views/Produtos.js";
import Caixas from "./views/Caixas";
import AddCompra from "./views/AddCompra";
import User from "./views/User";
import ViewUser from "./views/ViewUser";
import AddCaixa from "./views/AddCaixa";
import ViewCaixa from "./views/ViewCaixa";
import MeuCaixa from "./views/MeuCaixa";
import TodosCaixas from "./views/TodosCaixas";
import FechandoCaixa from "./views/FechandoCaixa";
import { Footer } from "./components/Footer.js";
import Estoque from "./views/Estoque.js";
import AddProduto from "./views/AddProduto.js";
import Produtos from "./views/Produtos.js";
import Estatisticas from "./views/Estatisticas.js";

function App() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("token");
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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/login");
  };

  const userId = localStorage.getItem("userId");

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
  const formatarValor = (valor) => {
    if (valor) {
      const valorFormatado = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }
  };
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getUser = async (userId) => {
      try {
        const data = await api.getUserNav(userId);
        setUserData(data);
      } catch (error) {
        setError(error);
      }
    };
    getUser(userId);
  }, []);

  const [isAdmin, setIsAdmin] = useState(
    () => userData && userData.admin === true
  );

  useEffect(() => {
    if (userData && userData.admin !== undefined) {
      setIsAdmin(userData.admin === true);
    }
  }, [userData]);
  // console.log("UserData: ", userData);
  // console.log("isAdmin: ", isAdmin);
  useEffect(() => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 10000);
  }, [message, setMessage, error, setError]);
  return (
    <div className="sys-back">
      {loggedIn ? (
        <AppNavbar
          onLogout={logout}
          isAdmin={isAdmin}
          userData={userData}
          setUserData={setUserData}
          setError={setError}
          userId={userId}
        />
      ) : null}

      <Routes>
        {loggedIn ? (
          <>
            <Route
              path="/logout/"
              element={
                <Logout
                  message={message}
                  setMessage={setMessage}
                  error={error}
                  setError={setError}
                />
              }
            />
            <Route
              path="/estatisticas/compras/"
              element={
                <Compras
                  message={message}
                  setMessage={setMessage}
                  loading={loading}
                  setLoading={setLoading}
                  loadingGif={loadingGif}
                  error={error}
                  setError={setError}
                  userData={userData}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              }
            />
            <Route
              path="/estatisticas/vendas/"
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
              path="/vendas/cadastrando"
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
                  userData={userData}
                />
              }
            />
            <Route
              path="/estatisticas/"
              element={
                <Estatisticas
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
                  openModal={openModal}
                  closeModal={closeModal}
                  showModal={showModal}
                />
              }
            />
            <Route
              path="/compras/cadastrando"
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
                  openModal={openModal}
                  closeModal={closeModal}
                  showModal={showModal}
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
              path="/produtos/cadastrando"
              element={
                <AddProduto
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
                  userData={userData}
                />
              }
            />
            <Route
              path="/dispositivos/"
              element={
                <Estoque
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
                  userData={userData}
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
                  userData={userData}
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
              path="/"
              element={
                <MeuCaixa
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
                  userData={userData}
                  formatarValor={formatarValor}
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
              path="/todos-caixas/"
              element={
                <TodosCaixas
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

            <Route
              path="/caixa/fechando/:caixa_id"
              element={
                <FechandoCaixa
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
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={
                <LoginPage
                  handleLogin={handleLogin}
                  handleSignup={handleSignup}
                  message={message}
                  setMessage={setMessage}
                  error={error}
                  setError={setError}
                />
              }
            />
            <Route
              path="/logout/"
              element={
                <Logout
                  message={message}
                  setMessage={setMessage}
                  error={error}
                  setError={setError}
                />
              }
            />
          </>
        )}
      </Routes>
      {loggedIn ? <Footer /> : null}
    </div>
  );
}

export default App;
