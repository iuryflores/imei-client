import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.utils";

const User = ({
  error,
  setError,
  loading,
  setLoading,
  loadingGif,
  userId,
  userData,
  formatarDataEHora,
}) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log(error, "Error to get users");
      }
    };
    getUsers();
  }, [setLoading]);

  const goToUser = (userId) => {
    navigate(`/usuarios/${userId}/`);
  };
  return (
    <div>
      <div className="container mt-3">
        <div className="mx-3">
          <h4>
            <i className="bi bi-people-fill"></i> Usuários
          </h4>
        </div>
        <hr />
      </div>
      <div className="container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Ativo?</th>
              <th scope="col">Nome completo</th>
              <th scope="col" className="no-mobile">
                CPF
              </th>
              <th scope="col">Email</th>
              <th>Cadastro</th>
              <th>Última alteração</th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              users.map((user, index) => {
                let iconActive;
                if (user.status === true) {
                  iconActive = "green";
                } else {
                  iconActive = "red";
                }

                return (
                  <tr
                    key={index}
                    className="clickable"
                    onClick={() => goToUser(user._id)}
                  >
                    <th scope="row" style={{ color: iconActive }}>
                      <i className="bi bi-circle-fill"></i>
                    </th>
                    <td>
                      {user.full_name}
                      {user.admin === true ? " (Administrador)" : ""}
                    </td>
                    <td>{user.cpf}</td>
                    <td className="no-mobile">{user.email}</td>
                    <td>
                      {new Intl.DateTimeFormat("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).format(new Date(user.createdAt))}
                      h
                    </td>
                    <td>{formatarDataEHora(user.updatedAt)}h</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  <img
                    style={{ width: "100px" }}
                    src={loadingGif}
                    alt="Loading gif"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
