import React, { useEffect, useState } from "react";
import SearchFornecedor from "../components/SearchFornecedor";
import ImeiReader from "../components/ImeiReader";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";

import InputMask from "react-input-mask";

const AddCompra = ({ message, setMessage, userId }) => {
  const [error, setError] = useState(null);
  //formulario de registro da compra
  const [customerData, setCustomerData] = useState({
    description: "",
    brand: "",
    buyDate: "",
  });
  //pick fornecedor
  const [selectedItem, setSelectedItem] = useState(null);

  //IMEI components
  const [imeiArray, setImeiArray] = useState([]);

  const [errorImei, setErrorImei] = useState(null);

  const handleImeiAdd = async (imei) => {
    try {
      await api.buscarImeiDadosCompra(imei);

      // Verifica se o IMEI já existe no imeiArray
      const isImeiAlreadyAdded = imeiArray.some(
        (existingImei) => existingImei.number === imei
      );
      if (!isImeiAlreadyAdded) {
        // If the IMEI doesn't exist in imeiArray, add it without porcento and price
        setImeiArray([...imeiArray, { number: imei }]);
      } else {
        setErrorImei("IMEI já incluso nessa compra!");
      }
    } catch (error) {
      setErrorImei(error);
      console.error(error);
    }
  };

  //remove Imei
  const removeImei = (index) => {
    const updatedImeiArray = [...imeiArray];
    updatedImeiArray.splice(index, 1);
    setImeiArray(updatedImeiArray);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [price, setPrice] = useState("");
  const [priceDb, setPriceDb] = useState("");

  const handleValorChange = (e) => {
    const inputValor = e.target.value;
    const valorNumerico = parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;
    setPriceDb(valorNumerico);

    if (!isNaN(valorNumerico)) {
      setPrice(
        valorNumerico.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setPrice("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customerData) {
      try {
        const newCompra = await api.addImei({
          customerData,
          priceDb,
          selectedItem,
          imeiArray,
          userId,
        });
        if (newCompra) {
          // Em seguida, limpo o formulário e fecho o modal.
          setCustomerData({
            description: "",
            brand: "",
            buyDate: "",
            imeiArray: "",
          });
          setCustomerData("");
          setSelectedItem("");
          setPrice("");
          setPriceDb("");
          setMessage("Compra cadastrada com sucesso!");
          navigate("/compras/");
          setTimeout(() => {
            setMessage("");
          }, 5000);
        }
      } catch (error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 10000);
  }, []);

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Registrando Compra
        </h5>

        <form className="d-flex flex-column align-items-end">
          <div className="d-flex align-items-baseline">
            <div className="form-group">
              <label htmlFor="buyDate">Data da compra</label>
              <input
                type="date"
                className="form-control"
                id="buyDate"
                name="buyDate"
                value={customerData.buyDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group w-100">
            <SearchFornecedor
              title="Fornecedor"
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              setError={setError}
              error={error}
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
              {errorImei && (
                <div className="alert alert-danger">{errorImei}</div>
              )}

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
                        IMEI {index + 1}: {imei.number}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="form-group">
                <label htmlFor="price">Valor (individual):</label>

                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="price"
                  name="price"
                  value={price}
                  placeholder="0,00"
                  onChange={handleValorChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </form>
        <div className="d-flex flex-column align-items-end">
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
export default AddCompra;
