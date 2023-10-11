import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { VendaAdd } from "../components/VendaAdd.js";
import { Link, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
  }, [setLoading]);

  const updateVendaList = (newVenda) => {
    setVendas([...vendas, newVenda]);
  };
  let valorUnitario = 0;

  const formatarValor = (valor) => {
    if (valor) {
      const valorFormatado = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }
  };

  const deleteVenda = async (venda_id) => {
    try {
      const deleteVenda = await api.deleteVenda({ venda_id });
      if (deleteVenda) {
        navigate("/vendas/");
        setMessage(deleteVenda.msg);
      } else {
        console.log("nao foi possivel encontrar venda");
      }
    } catch (error) {
      console.log(error);
    }
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
                <th></th>
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
                      ({venda.imei_id.length}) -
                      {venda.imei_id.map((imei, index) => {
                        return (
                          <span key={index}>
                            [{imei.number}]
                            {index < venda.imei_id.length - 1 && ","}
                          </span>
                        );
                      })}
                    </td>
                    <td>R$ {formatarValor(valorUnitario)}</td>
                    <td>R$ {formatarValor(venda.price)}</td>
                    <td>
                      <div
                        className="btn btn-outline-danger"
                        onClick={() => {
                          deleteVenda(venda._id);
                        }}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </div>
                    </td>
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
