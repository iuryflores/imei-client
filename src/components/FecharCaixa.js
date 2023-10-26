import React, { useState } from "react";
import api from "../utils/api.utils";
import { useNavigate } from "react-router";

export const FecharCaixa = ({
  show,
  onClose,
  message,
  setMessage,
  error,
  setError,
  userId,
}) => {
  const [customerData, setCustomerData] = useState({
    saldoCaixa: "",
    saldoVewndas: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customerData) {
      try {
        await api.addCliente({ customerData, userId });
        setMessage("Cliente cadastrado(a) com sucesso!");
        // Em seguida, limpo o formulário e fecho o modal.
        setCustomerData({
          name: "",
          email: "",
          phone: "",
          document: "",
          type: "fisica",
        });
        onClose();
        setTimeout(() => {
          navigate(0);
        }, 5000);
      } catch (error) {
        setError(error);
      }
    }
  };

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

              <div className="form-group">
                <label htmlFor="saldoCaixa">
                  Informe o saldo final do caixa:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="saldoCaixa"
                  name="saldoCaixa"
                  value={customerData.saldoCaixa}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Saldo das vendas:</label>
                <input
                  type="number"
                  className="form-control"
                  id="saldoVendas"
                  name="saldoVendas"
                  value={customerData.saldoVendas}
                  onChange={handleChange}
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
