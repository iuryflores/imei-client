import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";

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
  caixaDiario,
  setCaixaDiario,
}) => {
  const [caixas, setCaixas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getCurrentFormattedDate());

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
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const userDataNew = await api.getUserNav(userId);
      setNewUser(userDataNew);
      setLoading(false);
    };
    getUser();

    setTimeout(() => {
      setError(null);
    }, 90000);
  }, []);

  useEffect(() => {
    const getCaixa = async () => {
      try {
        if (!newUser.caixa_id) {
          setError("Esse usuário não tem caixa definido!");
        }

        if (selectedDate && newUser.caixa_id) {
          const caixa_id = newUser.caixa_id;
          const getCaixaDia = await api.getCaixaDia(selectedDate, caixa_id);
          setCaixas(getCaixaDia);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (newUser) {
      getCaixa();
    }
  }, [selectedDate, newUser]);
  const sumLancamentos = () => {
    return caixas
      .reduce((total, caixa) => {
        return total + caixa.valor;
      }, 0)
      .toFixed(2);
  };

  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const totalValue = sumLancamentos();
    setValorTotal(parseFloat(totalValue));
  }, [caixas]);

  const renderTable = () => {
    if (loading === false) {
      return (
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Origem</th>
              <th>Forma de pagamento</th>
              <th>Valor</th>
              <th className="text-center">Conciliado</th>
            </tr>
          </thead>
          <tbody>
            {caixas.map((caixa, index) => {
              return (
                <tr key={index}>
                  <td>{formatarDataEHora(caixa.createdAt)}</td>
                  <td>{caixa.description}</td>
                  <td>{caixa.tipo}</td>
                  <td>{caixa.origem_id}</td>
                  <td>{caixa.forma_pagamento}</td>
                  <td>R$ {formatarValor(caixa.valor)}</td>
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

  let caixaId = newUser.caixa_id;

  //VERIFICA SE EXISTE CAIXA ABERTO
  useEffect(() => {
    const checkCaixaAberto = async () => {
      try {
        const caixaAberto = await api.checkCaixaAberto(selectedDate);
        setCaixaDiario(caixaAberto);
      } catch (error) {
        console.log(error);
      }
    };
    checkCaixaAberto();
  }, []);

  //ABRE O CAIXA
  const handleAbrirCaixa = async () => {
    try {
      const abrirCaixa = await api.abrirCaixa({ userId, selectedDate });
      setCaixaDiario(abrirCaixa);
    } catch (error) {
      console.log(error);
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
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <div className="d-flex align-items-center alert alert-info">
            <span>
              Saldo Atual:{" "}
              <b>R$ {formatarValor(valorTotal) || <span>0,00</span>}</b>
            </span>
          </div>
        </div>
      </div>
      <hr />
      {!caixaId && (
        <div className="alert alert-danger text-center">
          <b>Nenhum caixa foi definido para esse Usuário.</b>
        </div>
      )}

      {message ? <div className="alert alert-success">{message}</div> : null}

      {caixas.length > 0 ? (
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
