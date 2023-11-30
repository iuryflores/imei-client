import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { Link } from "react-router-dom";

const Estoque = ({
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
  const [estoque, setEstoque] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEstoque, setFilteredEstoque] = useState([]);

  useEffect(() => {
    const getEstoque = async () => {
      try {
        setLoading(true);
        const estoque = await api.getEstoque();
        setEstoque(estoque);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getEstoque();
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
  for (let index = 0; index < estoque.length; index++) {
    if (estoque[index].buy_id) {
      const element = estoque[index].buy_id || null;
      valorEstoque += element.price;
    }
  }
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filtrar o estoque com base no termo de pesquisa
    const filteredResults = estoque.filter((produto) =>
      produto.buy_id.produto_id.description
        .toLowerCase()
        .includes(term.toLowerCase())
    );

    setFilteredEstoque(filteredResults);
  };
  const renderTable = () => {
    const estoqueToRender = searchTerm ? filteredEstoque : estoque;

    if (loading === false) {
      if (estoqueToRender.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data (compra)</th>
                <th>Nº da compra</th>
                <th>IMEI's</th>
                <th>Valor (compra)</th>
                <th>Valor (venda)</th>
              </tr>
            </thead>
            <tbody>
              {estoqueToRender.map((produto, index) => {
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
                      {produto.buy_id.produto_id &&
                        produto.buy_id.produto_id.description}{" "}
                      (IMEI: {produto.number})
                    </td>
                    <td>R$ {formatarValor(produto.buy_id.price)}</td>
                    <td>R$ {formatarValor(produto.buy_id.sellPrice)}</td>
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
        <h3>
          <i className="bi bi-phone-vibrate mx-3"></i>Dispositivos em estoque
        </h3>
        <div className="mb-3">
          <div className="d-flex align-items-center alert alert-info">
            <span>
              Quantidade: <b> {estoque.length}</b>
            </span>
            <span className="mx-3"> | </span>
            <span>Total: R$ {formatarValor(valorEstoque)}</span>
          </div>

          <Link className="btn btn-success" to={"/compras/cadastrando"}>
            Cadastrar compra
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
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
    </div>
  );
};

export default Estoque;
