import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";
import { FecharCaixa } from "../components/FecharCaixa";
import { ViewVenda } from "../components/ViewVenda.js";
import { Link, useParams } from "react-router-dom";

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
  const [vendas, setVendas] = useState("");

  const [error, setError] = useState(null);

  const { caixa_id } = useParams();

  useEffect(() => {
    const getVendas = async () => {
      try {
        setLoading(true);
        const data = await api.getVendasByCaixaId(caixa_id);
        setDataVendas(data);
        setVendas(data.vendas);
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

  let valorTotalVendas = 0;
  for (let index = 0; index < vendas.length; index++) {
    valorTotalVendas += vendas[index].price;
  }

  const formatarDataSemHora = (dataParaFormatar) => {
    let dataObj = new Date(dataParaFormatar);
    let dia = dataObj.getUTCDate();
    let mes = dataObj.getUTCMonth() + 1;
    let ano = dataObj.getUTCFullYear();
    let dataFormatada = dia + "/" + mes + "/" + ano;
    return dataFormatada;
  };

  const [showModalVenda, setShowModalVenda] = useState(false);

  const [vendaView, setVendaView] = useState(null);

  const showVenda = (venda) => {
    setVendaView(venda);
    setShowModalVenda(true);

    console.log(venda);
  };

  const closeVendaModal = () => {
    setShowModalVenda(false);
  };

  const renderTable = () => {
    if (dataVendas && vendas) {
      return (
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Vendedor</th>
              <th className="text-center" style={{ width: "5%" }}>
                Visualizar
              </th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda, index) => {
              return (
                <tr key={index}>
                  <td>{formatarDataSemHora(venda.dateSell)}</td>
                  <td>
                    Registrou a <b>VEN{venda.sell_number}</b>
                  </td>
                  <td>R$ {formatarValor(venda.price)}</td>
                  <td>{venda.user_sell.full_name}</td>
                  <td className="text-center">
                    <i
                      className="bi bi-eye-fill clickable"
                      onClick={() => showVenda(venda)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="text-center text-dark">
          Nenhum lançamento cadastrado!
        </div>
      );
    }
  };

  return (
    <div className="p-3 m-3  d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h3>
          <i className="bi bi-coin"></i> Caixa do dia{" "}
          {formatarDataSemHora(dataVendas.data)}
        </h3>
        <div className="">
          <Link className="btn btn-warning mx-3" to="/todos-caixas">
            Voltar
          </Link>
          <div className="btn btn-success" onClick={fecharCaixa}>
            Fechar caixa
          </div>
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
      <div className=" d-flex flex-column align-items-end mt-2">
        <div className="alert alert-info">
          Valor do Caixa:{" "}
          <b> R$ {formatarValor(valorTotalVendas) || <span> 0.00</span>}</b>
        </div>
      </div>
      {/* Modal do caixa */}
      <FecharCaixa
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
        valorTotalVendas={valorTotalVendas}
        formatarValor={formatarValor}
        dataVendas={dataVendas}
      />
      {/* Modal da venda */}
      <ViewVenda
        showModalVenda={showModalVenda}
        closeVendaModal={closeVendaModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
        vendaView={vendaView}
      />
    </div>
  );
};

export default FechandoCaixa;
