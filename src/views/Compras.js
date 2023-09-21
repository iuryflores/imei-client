import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { CompraAdd } from "../components/CompraAdd.js";

export const Compras = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
  loadingGif,
  userId,
  openModal,
  showModal,
  closeModal,
}) => {
  const [compras, setCompras] = useState([]);
  

  useEffect(() => {
    const getCompras = async () => {
      try {
        const getAllCompras = await api.getAllCompras();
        setCompras(getAllCompras);
      } catch (error) {
        console.error("Error fetching compras:", error);
      }
    };

    getCompras();
  }, []);

  const updateCompraList = (newCompra) => {
    setCompras([...compras, newCompra]);
  };

  const renderTable = () => {
    if (loading) {
      if (compras.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data Compra</th>
                <th>Fornecedor</th>
                <th>Produto</th>
                <th>IMEI</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra, index) => (
                <tr key={index}>
                  <td>
                    {new Date(compra.dateBuy).toLocaleDateString("pt-br", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="capitalize">
                    {compra.fornecedor_id.full_name}
                  </td>
                  <td>
                    {compra.brand} {compra.description}
                  </td>
                  <td>
                    {
                      compra.imei_id && Array.isArray(compra.imei_id)
                        ? compra.imei_id.map((imei, index) => {
                            return <span key={index}>[{imei.number}]</span>;
                          })
                        : "N/A" // ou outra mensagem ou tratamento adequado
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        return <div className="text-center">Nenhuma compra registrada!</div>;
      }
    } else {
      return (
        <div className="d-flex justify-content-center">
          <img style={{ width: "100px" }} src={loadingGif} alt="Loading gif" />
        </div>
      );
    }
  };

  return (
    <div className="p-3 m-3 text-light d-flex flex-column align-items-center">
      <h1>Compras</h1>
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
        {renderTable()}
      </div>
      {/* Modal de cadastro de cliente */}
      <CompraAdd
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
        updateCompraList={updateCompraList}
      />
    </div>
  );
};
