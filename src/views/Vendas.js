import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { VendaAdd } from "../components/VendaAdd.js";
import numeral from "numeral";
import { Link } from "react-router-dom";

export const Vendas = ({
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
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    const getVendas = async () => {
      try {
        const data = await api.getAllVendas();
        setVendas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendas:", error);
      }
    };

    getVendas();
  }, [ setLoading]);

  const updateVendaList = (newVenda) => {
    setVendas([...vendas, newVenda]);
  };
  let valorUnitario = 0;

  const moneyMask = (valor) => {
    return numeral(valor).format("0000.00").replace(".", ",");
  };

  const renderTable = () => {
    if (loading === false) {
      if (vendas.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>IMEI's</th>
                <th>Valor (unitário)</th>
                <th>Valor (total)</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda, index) => {
                valorUnitario = venda.price / venda.imei_id.length;
                return (
                  <tr key={index}>
                    <td>
                      {new Date(venda.dateSell).toLocaleDateString("pt-br", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="capitalize">{venda.cliente_id.full_name}</td>
                    <td>
                      {venda.imei_id.map((imei, index) => {
                        return (
                          <span key={index}>
                            {imei.number}
                            {index < venda.imei_id.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </td>
                    <td>R$ {moneyMask(valorUnitario)}</td>
                    <td>R$ {moneyMask(venda.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        return (
          <div className="text-center text-dark">Nenhuma venda registrada!</div>
        );
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
    <div className="p-3 m-3  d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h1>Vendas</h1>
        <div className="mb-3">
          <Link
            className="d-flex align-items-center btn btn-outline-info"
            to="/vendas/cadastrando/"
          >
            <span>Adicionar</span>
            <i className="bi bi-plus-circle-fill mx-1 fs-6"></i>
          </Link>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
      {/* Modal de cadastro de cliente */}
      <VendaAdd
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
        updateVendaList={updateVendaList}
      />
    </div>
  );
};
