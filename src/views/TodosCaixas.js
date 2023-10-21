import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";

const TodosCaixas = ({
  message,
  setMessage,
  loading,
  setLoading,
  loadingGif,
  formatarData,
  formatarDataEHora,
}) => {
  const [caixas, setCaixas] = useState([]);

  useEffect(() => {
    const getCaixas = async () => {
      try {
        setLoading(true);
        const data = await api.getCaixasAbertos();
        setCaixas(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getCaixas();
  }, []);

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
              <th>Status</th>
              <th>Data do caixa</th>
              <th>Valor total do caixa</th>
              <th>Última alteração</th>
              <th>Usuário da abertura</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {caixas.map((caixa, index) => {
              var dataObj = new Date(caixa.data);
              var dia = dataObj.getUTCDate();
              var mes = dataObj.getUTCMonth() + 1;
              var ano = dataObj.getUTCFullYear();

              var dataFormatada = dia + "/" + mes + "/" + ano;

              let valorTotalVendas = 0;
              for (let index = 0; index < caixa.vendas.length; index++) {
                valorTotalVendas += caixa.vendas[index].price;
              }
              return (
                <tr key={index}>
                  <td>
                    <div
                      className={
                        caixa.status === true ? "btn btn-info" : "btn btn-dark"
                      }
                    >
                      {caixa.status === true ? "Aberto" : "Fechado"}
                    </div>
                  </td>
                  <td>{dataFormatada}</td>
                  <td>R$ {formatarValor(valorTotalVendas)}</td>
                  <td>{formatarDataEHora(caixa.updatedAt)}h</td>
                  <td>{caixa.userAbertura.full_name}</td>
                  <td>
                    <div className="btn btn-success">Fechar</div>
                  </td>
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
          <i className="bi bi-cash-coin"></i> Caixas abertos
        </h1>
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

export default TodosCaixas;
