import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { ClienteAdd } from "../components/ClienteAdd";

export const Clientes = () => {
  const [allClientes, setAllClientes] = useState([]);

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
  console.log(allClientes);
  return (
    <div className="p-3 border m-3 text-light">
      <h1>Lista de Clientes</h1>
      {/* Botão para abrir o modal */}
      <button onClick={openModal}>Cadastrar Cliente</button>

      {/* Lista de clientes aqui... */}

      {/* Modal de cadastro de cliente */}
      <ClienteAdd show={showModal} onClose={closeModal} />
    </div>
  );
};
