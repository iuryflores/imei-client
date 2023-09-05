import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { FornecedoresAdd } from "../components/FornecedoresAdd";

export const Fornecedores = ({ message, setMessage, error, setError }) => {
  const [allFornecedores, setAllFornecedores] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getFornecedores = async () => {
      try {
        const getFornecedores = await api.getAllFornecedores();
        setAllFornecedores(getFornecedores);
      } catch (error) {
        console.log(error);
      }
    };
    getFornecedores();
  }, []);
  return (
    <div className="p-3 m-3 text-light d-flex flex-column align-items-center">
      <h1>Lista de Fornecedores ({allFornecedores.length})</h1>
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
            {allFornecedores.map((fornecedor, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">
                    {fornecedor.type === "juridica" ? (
                      <i class="bi bi-building-fill"></i>
                    ) : (
                      <i class="bi bi-person-fill"></i>
                    )}
                  </td>
                  <td>{fornecedor.full_name}</td>
                  <td>{fornecedor.document}</td>
                  <td>{fornecedor.contact}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Modal de cadastro de cliente */}
      <FornecedoresAdd
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
      />
    </div>
  );
};
