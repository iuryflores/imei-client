import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";
import { Link, useNavigate } from "react-router-dom";

const Caixas = ({
  message,
  setMessage,
  loading,
  setLoading,
  loadingGif,
  formatarData,
  formatarDataEHora,
}) => {
  const [caixas, setCaixas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getCaixas = async () => {
      try {
        setLoading(true);
        const data = await api.getCaixas();
        setCaixas(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getCaixas();
  }, []);

  const goToCaixa = (caixaId) => {
    navigate(`/caixas/${caixaId}/`);
  };

  const formatarValor = (valor) => {
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  };
  const renderTable = () => {
    if (caixas.length > 0) {
      return (
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th className="text-center">Ativo?</th>
              <th>Data de Início</th>
              <th>Nome do Caixa</th>
              <th>Saldo Inicial</th>
              <th>Cadastro</th>
              <th>Última alteração</th>
            </tr>
          </thead>
          <tbody>
            {caixas.map((caixa, index) => {
              let iconActive;
              if (caixa.status === true) {
                iconActive = "green";
              } else {
                iconActive = "red";
              }

              return (
                <tr
                  key={index}
                  className="clickable "
                  onClick={() => goToCaixa(caixa._id)}
                >
                  <td style={{ color: iconActive }} className="text-center">
                    <i className="bi bi-circle-fill"></i>
                  </td>

                  <td>{formatarData(caixa.dia_inicio)}</td>
                  <td>{caixa.name}</td>
                  <td>R$ {formatarValor(caixa.saldo_inicial)}</td>
                  <td>{formatarDataEHora(caixa.createdAt)}h</td>
                  <td>{formatarDataEHora(caixa.updatedAt)}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="text-center text-dark">Nenhum caixa cadastrado!</div>
      );
    }
  };

  return (
    <div className="p-3 m-3  d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h1>
          <i className="bi bi-cash-coin"></i> Caixas
        </h1>
        <div className="mb-3">
          <Link
            className="d-flex align-items-center btn btn-outline-info"
            to="/caixas/cadastrando/"
          >
            <span>Adicionar</span>
            <i className="bi bi-plus-circle-fill mx-1 fs-6"></i>
          </Link>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      {!loading ? (
        <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
      ) : (
        <div className="d-flex justify-content-center">
          <img style={{ width: "100px" }} src={loadingGif} alt="Loading gif" />
        </div>
      )}
    </div>
  );
};

export default Caixas;
