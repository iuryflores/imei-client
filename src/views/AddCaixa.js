import React, { useState } from "react";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";

const AddCaixa = ({
  message,
  setMessage,
  error,
  setError,
  userId,
  updateVendaList,
  newVenda,
}) => {
  const [caixaData, setCaixaData] = useState({
    ativo: false,
    nome: "",
    dataInicio: "",
    saldoInicial: 0,
  });

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    const newValue = type === "checkbox" ? event.target.checked : value;

    setCaixaData({ ...caixaData, [name]: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(caixaData);

    if (caixaData.nome && caixaData.dataInicio) {
      try {
        await api.addCaixas({
          caixaData,
          userId,
        });
        setCaixaData({
          nome: "",
          dataInicio: "",
          saldoInicial: 0,
        });

        setMessage("Caixa cadastrado com sucesso!");

        navigate("/caixas/");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } catch (error) {
        console.log({ error });
        //setError(error);
      }
    } else {
      setError("Os campos Nome e data de início são obrigatórios!");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Cadastrando Caixa
        </h5>

        <form className="d-flex flex-column container">
          {error ? <div className="alert alert-danger">{error}</div> : null}

          <div className="form-row d-flex mt-3 align-items-center">
            <div className="form-group col-md-10">
              <label className="w-100">
                Nome do Caixa:
                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  value={caixaData.nome}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
          <div className="form-row d-flex">
            <div className="form-group col-md-2">
              <label>
                Data de Início:
                <input
                  type="date"
                  className="form-control"
                  name="dataInicio"
                  value={caixaData.dataInicio}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-group col-md-2">
              <label>
                Saldo Inicial:
                <input
                  type="number"
                  className="form-control"
                  name="saldoInicial"
                  value={caixaData.saldoInicial}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
        </form>
        <div className="d-flex flex-column container align-items-start">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCaixa;
