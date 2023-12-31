import React, { useEffect, useMemo, useState } from "react";
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
  formatarData,
}) => {
  const navigate = useNavigate();

  const formatarValor = (valor) => {
    if (valor) {
      const valorFormatado = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }
  };

  //CAIXA
  const [lancamentos, setLancamentos] = useState([]);

  const [selectedDate, setSelectedDate] = useState(getCurrentFormattedDate());

  const [caixaDiario, setCaixaDiario] = useState(null);

  const [caixa_id, setCaixa_id] = useState("");

  function getCurrentFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // const [arrayVendas, setArrayVendas] = useState([]);
  //VERIFICA SE EXISTE CAIXA ABERTO
  useEffect(() => {
    const checkCaixaAberto = async () => {
      try {
        setLoading(true);
        const caixaAberto = await api.checkCaixaAberto(selectedDate);
        if (caixaAberto) {
          setCaixaDiario(caixaAberto);
          setCaixa_id(caixaAberto._id);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    checkCaixaAberto();
  }, [selectedDate]);

  //ABRE O CAIXA
  const handleAbrirCaixa = async () => {
    try {
      const abrirCaixa = await api.abrirCaixa({ userId, selectedDate });
      setCaixaDiario(abrirCaixa);
      navigate(0);
    } catch (error) {
      console.log(error);
      if (error === "Sua sessão expirou, é necessário fazer login novamente.") {
        navigate("/login/");
      } else {
        setError(error);
      }
    }
  };
  //DEVOLVER
  const handleDevolver = async (vendaID) => {
    try {
      setLoading(true);
      const devolvido = await api.devolverVenda({ vendaID, userData });
      setLoading(false);
      if (devolvido) {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getLancamentos = async () => {
      try {
        const lancamentosData = await api.getLancamentosCaixa(caixa_id);
        setLancamentos(lancamentosData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (userData) {
      getLancamentos();
    }
    setLoading(false);
  }, [caixa_id, userData, caixaDiario]);

  const sumLancamentos = () => {
    return lancamentos
      .filter((caixa) => caixa.status !== "DEVOLVIDO")
      .reduce((total, caixa) => {
        return total + caixa.valor;
      }, 0)
      .toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  };

  const valorTotal = useMemo(() => sumLancamentos(), [lancamentos]);

  const formaPagamentoMap = {
    pix: "Pix",
    dinheiro: "Dinheiro",
    cartao_debito: "Débito",
    cartao_credito: "Crédito",
  };

  const renderTable = () => {
    return (
      <table className="table mb-0 table-striped table-hover">
        <thead>
          <tr>
            <th>Data</th>
            <th>Venda</th>
            <th>Cliente</th>
            <th>Forma de pagamento</th>
            <th>Valor</th>
            <th>Vendedor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lancamentos.map((caixa, index) => {
            return (
              <tr
                key={index}
                className={
                  caixa.status === "ATIVO"
                    ? "table-light"
                    : caixa.status === "DEVOLVIDO"
                    ? "table-danger"
                    : " "
                }
              >
                <td>{formatarDataEHora(caixa.createdAt)}h</td>
                <td>
                  <b>VEN{caixa.origem_id.sell_number}</b>
                </td>
                <td>{caixa.origem_id.cliente_id.full_name}</td>
                <td>{formaPagamentoMap[caixa.forma_pagamento]}</td>
                <td>R$ {formatarValor(caixa.valor)}</td>
                <td>{caixa.origem_id.user_sell.full_name}</td>
                <td>
                  {caixa.status !== "DEVOLVIDO" ? (
                    <>
                      <div
                        className="btn btn-success"
                        onClick={() => handleDevolver(caixa._id)}
                        title="Ver"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </div>
                      <div
                        className="btn btn-warning mx-2"
                        onClick={() => handleDevolver(caixa._id)}
                        title="Devolver"
                      >
                        <i className="bi bi-arrow-return-left"></i>
                      </div>
                    </>
                  ) : (
                    <div className="btn btn-danger disabled">Devolvido</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-3 m-3  d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h3>
          <i className="bi bi-cash-coin"></i> Caixa do dia
        </h3>
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
            disabled
            hidden
          />
          <div className="d-flex align-items-center alert alert-info">
            <span>
              Valor Atual:{" "}
              <b>R$ {formatarValor(valorTotal) || <span>0,00</span>}</b>
            </span>
          </div>
          <div className="d-flex align-items-center">
            {caixaDiario && (
              <Link className="btn btn-success" to={"/vendas/cadastrando"}>
                Vender
              </Link>
            )}
          </div>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}

      {lancamentos.length > 0 ? (
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
