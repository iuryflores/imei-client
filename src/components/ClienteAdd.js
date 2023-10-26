import React, { useState } from "react";
import api from "../utils/api.utils";
import InputMask from "react-input-mask";

export const ClienteAdd = ({
  show,
  onClose,
  message,
  setMessage,
  error,
  setError,
  userId,
  updateClienteList,
}) => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    type: "fisica",
  });


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
        const newCliente = await api.addCliente({ customerData, userId });
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
        updateClienteList(newCliente);
        setTimeout(() => {
          setMessage("");
        }, 4000);
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
            <h5 className="modal-title">Cadastro de Cliente</h5>
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
                  {customerData.type === "fisica" ? (
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
                  value={customerData.name}
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
                      checked={customerData.type === "fisica"}
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
                      checked={customerData.type === "juridica"}
                      onChange={handleChange}
                    />
                    Pessoa Jurídica
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="document">
                  {customerData.type === "fisica" ? (
                    <span>CPF</span>
                  ) : (
                    <span>CNPJ</span>
                  )}
                  :
                </label>
                {customerData.type === "fisica" ? (
                  <InputMask
                    className="form-control mb-3"
                    value={customerData.document}
                    name="document"
                    type="text"
                    mask="999.999.999-99"
                    onChange={handleChange}
                  />
                ) : (
                  <InputMask
                    className="form-control mb-3"
                    value={customerData.document}
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
                  value={customerData.email}
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
                  value={customerData.phone}
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
