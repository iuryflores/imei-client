import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { CompraAdd } from "../components/CompraAdd.js";
import numeral from "numeral";

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

  const updateCompraList = (newCompra) => {
    setCompras([...compras, newCompra]);
  };

  useEffect(() => {
    const getCompras = async () => {
      try {
        const getAllCompras = await api.getAllCompras();
        setCompras(getAllCompras);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching compras:", error);
      }
    };

    getCompras();
  }, [loading, setLoading]);
  let valorTotal = 0;

  const moneyMask = (valor) => {
    return numeral(valor).format("0000.00").replace(".", ",");
  };

  const renderTable = () => {
    if (loading === false) {
      if (compras.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data</th>
                <th>Fornecedor</th>
                <th>Produto</th>
                <th>IMEI</th>
                <th>Valor (unitário)</th>
                <th>Valor (total)</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra, index) => {
                valorTotal = compra.imei_id.length * compra.price;
                return (
                  <tr
                    key={index}
                    className="clickable"
                    style={{ verticalAlign: "middle" }}
                  >
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
                    <td>{compra.description}</td>
                    <td>
                      {compra.imei_id.map((imei, index) => {
                        return (
                          <span key={index}>
                            {imei.number}
                            {index < compra.imei_id.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </td>
                    <td style={{ width: "fit-content" }}>
                      R$ {moneyMask(compra.price)}
                    </td>
                    <td style={{ width: "fit-content" }}>
                      R$ {moneyMask(valorTotal)}
                    </td>
                  </tr>
                );
              })}
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
