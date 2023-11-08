import React, { useEffect, useState } from "react";
import ImeiReader from "../components/ImeiReader";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";

const AddProduto = ({ message, setMessage, userId }) => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  //formulario de registro da compra
  const [formData, setFormData] = useState({
    description: "",
    brand: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData) {
      try {
        const newProduto = await api.addProduto({
          formData,
          userId,
        });
        if (newCompra) {
          // Em seguida, limpo o formulário e fecho o modal.
          setFormData({
            description: "",
            brand: "",
          });
          setMessage("Produto cadastrado com sucesso!");
          navigate("/produtos/");
        }
      } catch (error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 4000);
  }, []);

  let valorFormatado = parseFloat(priceDb * imeiArray.length);

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
              <div className="alert alert-success">
                <b>
                  Valor total: R$ {priceTotal && formataValor(valorFormatado)}
                </b>
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
export default AddProduto;
