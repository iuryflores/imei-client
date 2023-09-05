import React, { useState } from "react";
import InputMask from "react-input-mask";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";
export const FornecedoresAdd = ({
  show,
  onClose,
  message,
  setMessage,
  error,
  setError,
}) => {
  const [fornecedoresData, setFornecedoresData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    type: "fisica",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedoresData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fornecedoresData) {
      try {
        await api.addFornecedor({ fornecedoresData });
        setMessage("Fornecedor(a) cadastrado(a) com sucesso!");
        // Em seguida, limpe o formulário e feche o modal.
        setFornecedoresData({
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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cadastro de Fornecedor(a)</h5>
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
                <label htmlFor="name">
                  {fornecedoresData.type === "fisica" ? (
                    <span>Nome Completo</span>
                  ) : (
                    <span>Razão Social/Nome fantasia</span>
                  )}
                  :
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={fornecedoresData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Pessoa:</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="fisica"
                      checked={fornecedoresData.type === "fisica"}
                      onChange={handleChange}
                    />
                    Pessoa Física
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="juridica"
                      checked={fornecedoresData.type === "juridica"}
                      onChange={handleChange}
                    />
                    Pessoa Jurídica
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="document">
                  {fornecedoresData.type === "fisica" ? (
                    <span>CPF</span>
                  ) : (
                    <span>CNPJ</span>
                  )}
                  :
                </label>
                {fornecedoresData.type === "fisica" ? (
                  <InputMask
                    className="form-control mb-3"
                    value={fornecedoresData.document}
                    name="document"
                    type="text"
                    mask="999.999.999-99"
                    onChange={handleChange}
                  />
                ) : (
                  <InputMask
                    className="form-control mb-3"
                    value={fornecedoresData.document}
                    name="document"
                    type="text"
                    mask="99.999.999/9999-99"
                    onChange={handleChange}
                  />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={fornecedoresData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefone:</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={fornecedoresData.phone}
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
              Cadastrar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
