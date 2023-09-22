import React, { useState } from "react";
import InputSearch from "./InputSearch";
import ImeiReader from "./ImeiReader";
import api from "../utils/api.utils";

export const VendaAdd = ({
  show,
  onClose,
  message,
  setMessage,
  error,
  setError,
  userId,
  updateVendaList,
  newVenda,
}) => {
  //formulario de registro da venda
  const [customerData, setCustomerData] = useState({
    description: "",
    brand: "",
    price: "",
    buyDate: "",
  });
  //pick Cliente
  const [selectedItem, setSelectedItem] = useState(null);

  //IMEI components
  const [imeiArray, setImeiArray] = useState([]);

  const handleImeiAdd = (imei) => {
    setImeiArray([...imeiArray, imei]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //remove Imei
  const removeImei = (index) => {
    const updatedImeiArray = [...imeiArray];
    updatedImeiArray.splice(index, 1);
    setImeiArray(updatedImeiArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customerData) {
      try {
        const newVenda = await api.addVenda({
          customerData,
          selectedItem, //clienteID
          imeiArray,
          userId,
        });
        // Em seguida, limpo o formulário e fecho o modal.
        setCustomerData({
          description: "",
          brand: "",
          price: "",
          buyDate: "",
          imeiArray: "",
        });
        onClose();
        setMessage("Venda cadastrada com sucesso!");
        updateVendaList(newVenda);
        setTimeout(() => {
          setMessage("");
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
            <h5 className="modal-title">
              <i className="bi bi-cash-coin"></i> Registrando Venda
            </h5>
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
            <form className="d-flex flex-column align-items-end">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <div className="d-flex align-items-baseline">
                <div className="form-group">
                  <label htmlFor="buyDate">Data da venda</label>
                  <input
                    type="date"
                    className="form-control"
                    id="buyDate"
                    name="buyDate"
                    value={customerData.sellDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group w-100">
                <InputSearch
                  title="Cliente"
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </div>

              <div className="form-group w-100">
                <label htmlFor="description">Descrição:</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  placeholder="Ex. iPhone 12 Pro Max 256GB"
                  value={customerData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group w-100">
                <label htmlFor="brand">Marca:</label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  name="brand"
                  placeholder="Ex. Apple"
                  value={customerData.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="w-100 d-flex justify-content-between">
                <div className="w-50">
                  {/* Integre o componente ImeiReader e passe a função de callback */}
                  <ImeiReader onImeiAdd={handleImeiAdd} />
                  <div>
                    <label>IMEIs adicionados:</label>
                    <ul className="p-0">
                      {imeiArray.map((imei, index) => (
                        <li className="d-flex align-items-center" key={index}>
                          <div
                            className="btn btn-danger"
                            style={{ width: "auto" }}
                            onClick={() => removeImei(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </div>
                          <div className="lista-imeis w-100">
                            IMEI {index + 1}: {imei}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="price">Valor (individual):</label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    name="price"
                    value={customerData.price}
                    onChange={handleChange}
                  />
                </div>
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
