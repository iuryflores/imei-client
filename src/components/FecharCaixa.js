import React, { useState } from "react";
import api from "../utils/api.utils";
import { useNavigate } from "react-router";
import InputMask from "react-input-mask";

export const FecharCaixa = ({
  show,
  onClose,
  message,
  setMessage,
  error,
  setError,
  userId,
  valorTotalVendas,
  dataVendas,
}) => {
  const [saldoCaixa, setSaldoCaixa] = useState(valorTotalVendas);
  const caixaId = dataVendas._id;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saldoCaixa) {
      try {
        await api.fecharCaixa({ saldoCaixaDb, userId, caixaId, ...dataVendas });
        setMessage("O caixa foi fechado com sucesso!");
        setSaldoCaixa(0);
        onClose();
        navigate("/todos-caixas/");
      } catch (error) {
        setError(error);
      }
    }
  };
  console.log(saldoCaixa);

  const formatarValor = (valor) => {
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  };

  const [saldoCaixaDb, setSaldoCaixaDb] = useState(0);

  const handleValorChange = (e) => {
    const inputValor = e.target.value;
    const valorNumerico = parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;
    setSaldoCaixaDb(valorNumerico);

    if (!isNaN(valorNumerico)) {
      setSaldoCaixa(
        valorNumerico.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setSaldoCaixa("");
    }
  };
  console.log(dataVendas);
  return (
    <div className={`modal modal-lg ${show ? "show" : ""}`}>
      <div
        className="modal-dialog text-dark"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Fechando Caixa</h5>
            <div>
              <div
                className="d-flex align-items-center btn btn-outline-info  close"
                onClick={onClose}
              >
                <span>&times;</span>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <form>
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="alert alert-info">
                Valor das vendas: <b>R$ {formatarValor(valorTotalVendas)}</b>
              </div>
              <div className="form-group">
                <label htmlFor="saldoCaixa">
                  Informe o saldo final do caixa:
                </label>
                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="saldoCaixa"
                  name="saldoCaixa"
                  value={saldoCaixa}
                  onChange={handleValorChange}
                  className="form-control"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Fechar Caixa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
