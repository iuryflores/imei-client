import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
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
  }, [setVendas, setLoading]);

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
      setLoading(true);
      const deleteVenda = await api.deleteVenda({ venda_id, userId });
      setLoading(false);
      setMessage(deleteVenda.msg);

      // Remove the deleted venda from the list
      setVendas((prevVendas) =>
        prevVendas.filter((venda) => venda._id !== venda_id)
      );

      navigate("/vendas/");
      setTimeout(() => {
        setMessage("");
      }, 5000);
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
                <th>Nº da Venda</th>
                <th>Cliente</th>
                <th>Valor (unitário)</th>
                <th>Valor (total)</th>
                <th>Vendedor</th>
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
                    <td>
                      <b>VEN{venda.sell_number || ""}</b>
                    </td>
                    <td className="capitalize">{venda.cliente_id.full_name}</td>
                    <td>R$ {formatarValor(valorUnitario)}</td>
                    <td>R$ {formatarValor(venda.price)}</td>
                    <td>{venda.user_sell && venda.user_sell.full_name}</td>
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
          <div className="text-center text-dark alert alert-warning">
            Nenhuma venda registrada!
          </div>
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
    </div>
  );
};
