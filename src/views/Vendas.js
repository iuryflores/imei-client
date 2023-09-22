import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { VendaAdd } from "../components/VendaAdd.js";
import numeral from "numeral";

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
  }, [loading, setLoading]);

  const updateVendaList = (newVenda) => {
    setVendas([...vendas, newVenda]);
  };
  let valorTotal = 0;

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
                <th>Produto</th>
                <th>IMEI</th>
                <th>Valor (unitário)</th>
                <th>Valor (total)</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda, index) => {
                valorTotal = venda.imei_id.length * venda.price;
                return (
                  <tr key={index}>
                    <td>
                      {new Date(venda.dateBuy).toLocaleDateString("pt-br", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="capitalize">{venda.cliente_id.full_name}</td>
                    <td>{venda.description}</td>
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
                    <td>R$ {moneyMask(venda.price)}(k</td>
                    <td>R$ {moneyMask(valorTotal)}</td>
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
    <div className="p-3 m-3 text-light d-flex flex-column align-items-center">
      <h1>Vendas</h1>
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
