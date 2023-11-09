import React, { useEffect, useState } from "react";
import SearchFornecedor from "../components/SearchFornecedor";
import ImeiReader from "../components/ImeiReader";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";

import InputMask from "react-input-mask";
import SearchProduto from "../components/SearchProduto";

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
  const [selectedProduto, setSelectedProduto] = useState(null);

  //IMEI components
  const [imeiArray, setImeiArray] = useState([]);

  //HAS IMEI
  const [hasImei, setHasImei] = useState(true);

  const [errorImei, setErrorImei] = useState(null);

  const handleImeiAdd = async (imei, serial) => {
    try {
      await api.buscarImeiDadosCompra(imei);

      // Verifica se o IMEI já existe no imeiArray
      const isImeiAlreadyAdded = imeiArray.some(
        (existingImei) => existingImei.number === imei
      );
      if (!isImeiAlreadyAdded) {
        // If the IMEI doesn't exist in imeiArray, add it without porcento and price
        setImeiArray([...imeiArray, { number: imei, serial: serial }]);
      } else {
        setErrorImei("IMEI já incluso nessa compra!");
      }
      calculateTotalValue();
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
    calculateTotalValue();
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [price, setPrice] = useState(0);
  const [priceDb, setPriceDb] = useState(0);

  const [priceVenda, setPriceVenda] = useState(0);
  const [priceVendaDb, setPriceVendaDb] = useState(0);

  const [priceTotal, setPriceTotal] = useState(0);

  const handleValorChange = (e) => {
    const inputValor = e.target.value;
    const valorNumerico = parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;

    setPriceDb(valorNumerico);
    setPriceVendaDb(valorNumerico);

    if (!isNaN(valorNumerico)) {
      setPrice(
        valorNumerico.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );

      calculateTotalValue();
    } else {
      setPrice("");
    }
  };

  const handleValorVendaChange = (e) => {
    const inputValor = e.target.value;

    const valorNumericoVenda =
      parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;

    setPriceVendaDb(valorNumericoVenda);

    if (!isNaN(valorNumericoVenda)) {
      setPriceVenda(
        valorNumericoVenda.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setPrice("");
    }
  };

  const calculateTotalValue = (valorNumerico) => {
    if (!isNaN(valorNumerico)) {
      const totalValue = valorNumerico * imeiArray.length;
      setPriceTotal(totalValue);
    } else {
      setPriceTotal("Valor inválido"); // Ou defina uma mensagem apropriada
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customerData) {
      try {
        const newCompra = await api.addImei({
          customerData,
          priceDb,
          priceVendaDb,
          valorFormatado,
          selectedItem,
          selectedProduto,
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
          navigate("/estoque/");
          setTimeout(() => {
            setMessage("");
          }, 4000);
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

  const formataValor = (valor) => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  let valorFormatado = parseFloat(priceDb * imeiArray.length);

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Registrando Compra
        </h5>
        {error ? (
          <div className="alert alert-danger text-center">
            <b>{error}</b>
          </div>
        ) : null}
        <form className="d-flex flex-column align-items-end">
          <div className="w-100 d-flex justify-content-between flex-wrap">
            <div className=" col-12 col-lg-2">
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
            <div className=" col-12 col-lg-9">
              <div className="form-group">
                <SearchFornecedor
                  title="Fornecedor"
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  setError={setError}
                  error={error}
                />
              </div>
            </div>
          </div>
          <div className="w-100 d-flex justify-content-between flex-wrap">
            <div className=" col-12 col-lg-12">
              <div className="form-group">
                <SearchProduto
                  title="Produto"
                  selectedProduto={selectedProduto}
                  setSelectedProduto={setSelectedProduto}
                  setError={setError}
                  error={error}
                />
              </div>
            </div>
          </div>
          <div className="w-100 d-flex justify-content-between flex-wrap">
            <div className="col-12 col-md-8">
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
                        <b> IMEI {index + 1}:</b> {imei.number}{" "}
                        {imei.serial ? <> - (Serial: {imei.serial})</> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="price">Valor de compra (individual):</label>
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
              <div className="form-group">
                <label htmlFor="price">Valor de venda (individual):</label>
                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="priceVenda"
                  name="priceVenda"
                  value={priceVenda}
                  placeholder="0,00"
                  onChange={handleValorVendaChange}
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
export default AddCompra;
