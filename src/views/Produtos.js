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

  const renderTable = () => {
    if (loading === false) {
      if (produtos.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data do cadastro</th>
                <th>Descrição</th>
                <th>Marca</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {new Date(produto.createdAt).toLocaleDateString("pt-br", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{produto.description}</td>
                    <td>{produto.brand}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        return (
          <div className="text-center text-dark alert alert-warning mt-3">
            Nenhum produto em produtos!
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
        <h1>Produtos</h1>
        <div className="mb-3">
          <Link className="btn btn-success" to={"/produtos/cadastrando"}>
            Cadastrar Produto
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
