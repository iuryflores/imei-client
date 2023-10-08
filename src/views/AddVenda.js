import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import SearchClient from "../components/SearchClient";
import ImeiReader from "../components/ImeiReader";

const AddVenda = ({
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

  const [erroImei, setErrorImei] = useState(null);
  const handleImeiAdd = async (imei) => {
    try {
      const getImei = await api.buscarImeiDados(imei);

      // Verifica se o IMEI já existe no imeiArray
      const isImeiAlreadyAdded = imeiArray.some(
        (existingImei) => existingImei.number === getImei.number
      );

      if (!isImeiAlreadyAdded) {
        setImeiArray([...imeiArray, { ...getImei, porcento: "" }]);
        // Se não existe, adiciona o IMEI ao imeiArray
      } else {
        setErrorImei("IMEI já foi incluído.");
      }
    } catch (error) {
      setErrorImei(error);
      console.error(error);
    }
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

  const formatarValor = (valor) => {
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
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

  const [valorVenda, setValorVenda] = useState(0);

  const sumImeis = () => {
    return imeiArray
      .reduce((total, imei) => {
        return (
          total +
          (imei.buy_id
            ? (imei.buy_id.price * parseFloat(imei.porcento || 0)) / 100 +
              imei.buy_id.price
            : 0)
        );
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    const totalValue = sumImeis();
    setValorVenda(parseFloat(totalValue));
  }, [imeiArray]);

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Registrando Venda
        </h5>

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
            <SearchClient
              title="Cliente"
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>

          <div className="w-100 d-flex justify-content-between">
            <div className="w-100">
              {/* Integre o componente ImeiReader e passe a função de callback */}
              <ImeiReader onImeiAdd={handleImeiAdd} />
              {erroImei && <div className="alert alert-danger">{erroImei}</div>}
              <div>
                <label>IMEIs adicionados a venda:</label>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th
                        className="text-center text-light"
                        style={{
                          backgroundColor: "grey",
                          borderRadius: "5px 5px 0 0",
                        }}
                        colSpan={2}
                      >
                        Lucro/Prejuízo
                      </th>
                    </tr>
                    <tr>
                      <th style={{ width: "5%" }}></th>
                      <th style={{ width: "20%" }}>IMEI</th>
                      <th style={{ width: "35%" }}>Descrição</th>
                      <th style={{ width: "10%" }}>Custo</th>
                      <th style={{ width: "10%", textAlign: "center" }}>%</th>
                      <th style={{ width: "10%", textAlign: "center" }}>
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {imeiArray &&
                      imeiArray.map((imei, index) => (
                        <tr key={index} className="lista-imeis w-100">
                          <td>
                            <div
                              className="btn btn-danger"
                              style={{ width: "auto" }}
                              onClick={() => removeImei(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </div>
                          </td>
                          <td>{imei.number}</td>
                          <td>{imei.buy_id && imei.buy_id.description}</td>
                          <td>
                            R$ {imei.buy_id && formatarValor(imei.buy_id.price)}
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              value={imei.porcento}
                              onChange={(e) => {
                                const updateImeiArray = [...imeiArray];
                                updateImeiArray[index].porcento =
                                  e.target.value;
                                setImeiArray(updateImeiArray);
                              }}
                              placeholder="Lucro/Desconto"
                            />
                          </td>
                          <td className="text-center bg-light">
                            R${" "}
                            {imei.buy_id &&
                              formatarValor(
                                (imei.buy_id.price *
                                  parseFloat(imei.porcento || 0)) /
                                  100 +
                                  imei.buy_id.price
                              )}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colSpan="2" className="text-center valorVenda">
                        Valor total da venda
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>

                      <td colSpan={2} className="valorVenda2">
                        R$ {valorVenda && formatarValor(valorVenda)}
                      </td>
                    </tr>
                  </tbody>
                </table>
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

export default AddVenda;
