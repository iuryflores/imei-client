import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { Link, useNavigate } from "react-router-dom";

const MeuCaixa = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
  loadingGif,
  userId,
  userData,
  formatarDataEHora,
  formatarValor,
}) => {
  const sumLancamentos = () => {
    return caixas
      .reduce((total, caixa) => {
        return total + caixa.valor;
      }, 0)
      .toFixed(2);
  };

  const [valorTotal, setValorTotal] = useState(0);

  //CAIXA
  const [caixas, setCaixas] = useState([]);

  const [selectedDate, setSelectedDate] = useState(getCurrentFormattedDate());

  const [caixaDiario, setCaixaDiario] = useState(null);

  function getCurrentFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Pad the month and day with leading zeroes if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const totalValue = sumLancamentos();
    setValorTotal(parseFloat(totalValue));
  }, [caixas]);

  const [arrayVendas, setArrayVendas] = useState([]);

  //VERIFICA SE EXISTE CAIXA ABERTO
  useEffect(() => {
    const checkCaixaAberto = async () => {
      try {
        setLoading(true);
        const caixaAberto = await api.checkCaixaAberto(selectedDate);
        setCaixaDiario(caixaAberto);
        setArrayVendas(caixaAberto.vendas);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    checkCaixaAberto();
  }, [selectedDate]);

  const navigate = useNavigate();

  //ABRE O CAIXA
  const handleAbrirCaixa = async () => {
    try {
      const abrirCaixa = await api.abrirCaixa({ userId, selectedDate });
      setCaixaDiario(abrirCaixa);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCaixa = async () => {
      try {
        if (selectedDate) {
          const getCaixaDia = await api.getCaixaDia(selectedDate);
          setCaixas(getCaixaDia);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userData) {
      getCaixa();
    }
    setLoading(false);
  }, [selectedDate, userData, caixaDiario]);

  console.log(caixas);

  const renderTable = () => {
    if (loading === false) {
      return (
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Forma de pagamento</th>
              <th>Valor</th>
              <th>Vendedor</th>
              <th className="text-center">Conciliado</th>
            </tr>
          </thead>
          <tbody>
            {caixas.map((caixa, index) => {
              let newForma;
              switch (caixa.forma_pagamento) {
                case "pix":
                  newForma = "Pix";
                  break;
                case "cartao_debito":
                  newForma = "Débito";
                  break;
                case "cartao_credito":
                  newForma = "Crédito";
                  break;

                default:
                  break;
              }
              return (
                <tr
                  key={index}
                  className={caixa.tipo === "ENTRADA" ? "table-light" : " "}
                >
                  <td>{formatarDataEHora(caixa.createdAt)}h</td>
                  <td>
                    <b>
                      VEN
                      {;
                      })}
                    </b>{" "}
                    <small>({caixa.origem_id})</small>
                  </td>
                  <td>{}</td>
                  <td>{caixa.tipo}</td>
                  <td>{newForma}</td>
                  <td>R$ {formatarValor(caixa.valor)}</td>
                  <td>
                    {arrayVendas.map((venda, index) => {
                      return venda.user_sell.full_name;
                    })}
                  </td>
                  <td className="text-center">
                    <i
                      style={{
                        backgroundColor: caixa.conciliado ? "green" : " ",
                        color: caixa.conciliado ? "white" : " #ccc",
                        border: caixa.conciliado
                          ? "2px solid"
                          : "1px solid #ccc",
                        borderRadius: caixa.conciliado ? "5px" : "",
                        padding: "2px 5px",
                      }}
                      className="bi bi-check-lg"
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
        <div className="d-flex justify-content-center">
          <img style={{ width: "100px" }} src={loadingGif} alt="Loading gif" />
        </div>
      );
    }
  };

  return (
    <div className="p-3 m-3  d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h1>
          <i className="bi bi-cash-coin"></i> Caixa
        </h1>
        {!caixaDiario && (
          <div className="d-flex flex-column align-items-center">
            <h5>Não existe nenhum caixa aberto para o dia de hoje.</h5>
            <div className="btn btn-outline-success" onClick={handleAbrirCaixa}>
              Abrir caixa
            </div>
          </div>
        )}
        <div className="mb-3">
          <input
            className="form-control"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} disabled
          />
          <div className="d-flex align-items-center alert alert-info">
            <span>
              Saldo Atual:{" "}
              <b>R$ {formatarValor(valorTotal) || <span>0,00</span>}</b>
            </span>
          </div>
          <div className="d-flex align-items-center">
            {caixaDiario && (
              <Link className="btn btn-success" to={"/cadastrando/vendas/"}>
                Vender
              </Link>
            )}
          </div>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}

      {arrayVendas.length > 0 ? (
        <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
      ) : (
        <div className="text-center text-dark alert alert-warning mt-3">
          Nenhum lançamento registrado!
        </div>
      )}
    </div>
  );
};

export default MeuCaixa;
