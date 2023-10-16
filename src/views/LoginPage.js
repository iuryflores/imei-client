import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import api from "../utils/api.utils.js";
import InputMask from "react-input-mask";

export const LoginPage = ({
  handleLogin,
  handleSignup,
  message,
  setMessage,
  error,
  setError,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Necessário preencher usuário e senha!");
    } else {
      try {
        await api.login({ username, password });
        handleLogin(username);
      } catch (error) {
        setError(error);
      }
    }
  };
  const [signupMode, setSignupMode] = useState(false);

  const signModeSwith = () => {
    setSignupMode(!signupMode);
    setError(null);
  };

  const [newUsername, setNewUsername] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      try {
        await api.signup({ newUsername, confirmPassword, cpf, email });
        setMessage("Usuário criado com sucesso!");
        handleSignup(newUsername, newPassword, cpf, email);
        signModeSwith(false);
      } catch (error) {
        setError(error);
      }
    } else {
      setError("Senhas não são iguais");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 10000);
  }, [setError, setMessage]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-12 login-container">
        {signupMode ? (
          <form onSubmit={handleSignupSubmit} className="p-3 container-wrap">
            <h2 className="mb-3">Cadastro de usuário</h2>
            <div className="mb-3">
              <label htmlFor="newUsername" className="form-label">
                Nome completo
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Usuário"
                value={newUsername}
                autoComplete="username"
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <label htmlFor="newPassword" className="form-label">
              Senha
            </label>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={newPassword}
                autoComplete="current-password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Senha
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                autoComplete="current-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">
                CPF
              </label>
              <InputMask
                className="form-control mb-3"
                value={cpf}
                name="cpf"
                type="text"
                mask="999.999.999-99"
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>{" "}
            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">
                Email
              </label>
              <input
                className="form-control mb-3"
                value={email}
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column align-items-center w-100 mt-3">
              {message && (
                <div className="alert alert-success d-flex flex-column align-items-center w-100">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger d-flex flex-column align-items-center w-100 text-center">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-3 d-flex flex-column mb-3">
              <button type="submit" className="btn btn-primary">
                Registrar
              </button>
            </div>
            <div className="mt-3 d-flex flex-column">
              <span className="d-flex flex-column align-items-center w-100">
                Já tem uma conta?{" "}
              </span>
              <span className="btn btn-outline-primary" onClick={signModeSwith}>
                {" "}
                Faça login
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="container-wrap">
            <h1>
              <i className="bi bi-phone-vibrate"></i> IMEIGyn
            </h1>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Usuário"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-3 d-flex flex-column mb-3">
              <button type="submit" className="btn btn-primary">
                Entrar
              </button>
            </div>
            <div className="d-flex flex-column align-items-center w-100 mt-3">
              {message && (
                <div className="alert alert-success d-flex flex-column align-items-center w-100">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger d-flex flex-column align-items-center w-100 text-center">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-3 d-flex flex-column">
              <span className="d-flex flex-column align-items-center w-100">
                Não tem uma conta?{" "}
              </span>
              <span className="btn btn-outline-primary" onClick={signModeSwith}>
                Cadastre-se
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ...
