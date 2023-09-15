import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { ClienteAdd } from "../components/ClienteAdd";

export const Clientes = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
}) => {
  const [allClientes, setAllClientes] = useState([]);

  const userId = sessionStorage.getItem("userId");

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getClientes = async () => {
      try {
        const getAllClientes = await api.getAllClients();
        setAllClientes(getAllClientes);
      } catch (error) {
        console.log(error);
      }
    };
    getClientes();
  }, []);
  return (
    <div className="p-3 m-3 text-light d-flex flex-column align-items-center">
      <h1>Lista de Clientes</h1>
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="mb-3">
        <div
          className="d-flex align-items-center btn btn-outline-info"
          onClick={openModal}
        >
          <span>Adicionar</span>
          <i className="bi bi-plus-circle-fill mx-1 fs-6"></i>
        </div>
      </div>
      <div className="border p-2 bg-light shadow rounded w-100">
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th className="text-center">PF/PJ</th>
              <th>Nome Completo/Razão Social</th>
              <th>CPF/CNPJ</th>
              <th>Contato</th>
            </tr>
          </thead>
          <tbody>
            {allClientes.length > 0 ? (
              allClientes.map((cliente, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">
                      {cliente.type === "juridica" ? (
                        <i className="bi bi-building-fill"></i>
                      ) : (
                        <i className="bi bi-person-fill"></i>
                      )}
                    </td>
                    <td>{cliente.full_name}</td>
                    <td>{cliente.document}</td>
                    <td>{cliente.contact}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Nenhum cliente cadastrado!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal de cadastro de cliente */}
      <ClienteAdd
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
      />
    </div>
  );
};
