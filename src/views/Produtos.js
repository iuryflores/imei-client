import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { Link, useNavigate } from "react-router-dom";

const Produtos = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
  loadingGif,
  userData,
}) => {
  const [produtos, setProdutos] = useState([]);

  const navigate = useNavigate();

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

  const handleDelete = async (produtoID) => {
    try {
      setLoading(true);
      const deletedProduto = await api.deleteProduto(produtoID);
      if (deletedProduto) {
        setLoading(false);
        navigate(0);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError("Não foi possível deletar o produto!");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEstoque, setFilteredEstoque] = useState([]);
  
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filtrar o estoque com base no termo de pesquisa
    const filteredResults = produtos.filter((produto) =>
      produto.description.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredEstoque(filteredResults);
  };

  const renderTable = () => {
    const produtosToRender = searchTerm ? filteredEstoque : produtos;
    if (loading === false) {
      if (produtosToRender.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data do cadastro</th>
                <th>Descrição</th>
                <th>Marca</th>
                <th>Quantidade</th>
                <th style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {produtosToRender.map((produto, index) => {
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
                    <td>{produto.qtd}</td>
                    <td>
                      {produto.qtd <= 0 && userData.admin ? (
                        <div
                          className="btn btn-danger"
                          onClick={() => handleDelete(produto._id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </div>
                      ) : null}{" "}
                    </td>
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
        <h3>
          <i className="bi bi-phone-vibrate mx-3"></i>Estoque
        </h3>
        <div className="mb-3">
          <Link className="btn btn-success" to={"/produtos/cadastrando"}>
            Cadastrar Produto
          </Link>
        </div>
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Pesquisar produto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
    </div>
  );
};

export default Produtos;
