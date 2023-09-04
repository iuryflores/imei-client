import React, { useState } from "react";

export const ClienteAdd = ({show, onClose}) => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  });

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Adicione a lógica para enviar os dados do cliente para o servidor aqui (por exemplo, uma solicitação POST).
    // Em seguida, limpe o formulário e feche o modal.
    console.log("Dados do Cliente:", customerData);
    setCustomerData({
      name: "",
      email: "",
      phone: "",
    });
    onClose();
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div
        className="modal-dialog text-dark"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cadastro de Cliente</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="name">Nome:</label>
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
