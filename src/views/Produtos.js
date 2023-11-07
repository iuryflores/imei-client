import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { Link } from "react-router-dom";

const Produtos = ({
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
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const getProdutos = async () => {
      try {
        setLoading(true);
        const produtos = await api.getProdutos();
        setProdutos(produtos);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getProdutos();
  }, [setLoading]);

  const formatarValor = (valor) => {
    if (valor) {
      const valorFormatado = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }
  };

  let valorEstoque = 0;
  for (let index = 0; index < produtos.length; index++) {
    if (produtos[index].buy_id) {
      const element = produtos[index].buy_id || null;
      valorEstoque += element.price;
    }
  }

  const renderTable = () => {
    if (loading === false) {
      if (produtos.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data (compra)</th>
                <th>Nº da compra</th>
                <th>IMEI's</th>
                <th>Valor (compra)</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {new Date(produto.buy_id.dateBuy).toLocaleDateString(
                        "pt-br",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td>COM{produto.buy_id.buy_number || ""}</td>
                    <td>
                      {produto.buy_id.description} (IMEI: {produto.number})
                    </td>
                    <td>R$ {formatarValor(produto.buy_id.price)}</td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        return (
          <div className="text-center text-dark alert alert-warning mt-3">
            Nenhum produto em estoque!
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
        <h1>Estoque</h1>
        <div className="mb-3">
          <div className="d-flex align-items-center alert alert-info">
            <span>
              Quantidade: <b> {produtos.length}</b>
            </span>
            <span className="mx-3"> | </span>
            <span>Total: R$ {formatarValor(valorEstoque)}</span>
          </div>

          <Link className="btn btn-success" to={"/compras/cadastrando"}>
            Cadastrar compra
          </Link>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
    </div>
  );
};

export default Produtos;
