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
    <div className="p-3 border m-3 text-light">
      <h1>Lista de Fornecedores ({allFornecedores.length})</h1>
      {message ? <div className="alert alert-success">{message}</div> : null}
      <button onClick={openModal}>Cadastrar Fornecedor(a)</button>

      {allFornecedores.map((fornecedor, index) => {
        return <div key={index}>{fornecedor.full_name}</div>;
      })}

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
