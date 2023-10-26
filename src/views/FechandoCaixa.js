import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";
import { FecharCaixa } from "../components/FecharCaixa";
import { useParams } from "react-router-dom";

const FechandoCaixa = ({
  message,
  setMessage,
  loading,
  setLoading,
  loadingGif,
  formatarData,
  formatarDataEHora,
  showModal,
  setShowModal,
  closeModal,
  userId,
}) => {
  const [dataVendas, setDataVendas] = useState([]);

  const [error, setError] = useState(null);

  const { caixa_id } = useParams();

  useEffect(() => {
    const getVendas = async () => {
      try {
        setLoading(true);
        const data = await api.getVendasByCaixaId(caixa_id);
        setDataVendas(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getVendas();
  }, []);

  const formatarValor = (valor) => {
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  };

  const fecharCaixa = (caixaId) => {
    setShowModal(true);
    console.log(caixaId);
  };

  // let valorTotalVendas = 0;
  // for (let index = 0; index < dataVendas.vendas.length; index++) {
  //   valorTotalVendas += dataVendas.vendas[index].price;
  // }

  const renderTable = () => {
    if (dataVendas) {
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
            {dataVendas.vendas.map((venda, index) => {
              console.log(venda);
              var dataObj = new Date(venda.dateSell);
              var dia = dataObj.getUTCDate();
              var mes = dataObj.getUTCMonth() + 1;
              var ano = dataObj.getUTCFullYear();

              var dataFormatada = dia + "/" + mes + "/" + ano;

              return (
                <tr key={index}>
                  <td>{dataFormatada}</td>
                  <td>R$ {formatarValor(venda.price)}</td>
                  <td>{formatarDataEHora(venda.updatedAt)}h</td>
                  <td>{ venda.user_sell.full_name}</td>
                  <td>
                    <div
                      className="btn btn-success"
                      onClick={() => fecharCaixa(venda._id)}
                    >
                      Fechar
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

      {/* Modal do caixa */}
      <FecharCaixa
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
      />
    </div>
  );
};

export default FechandoCaixa;
