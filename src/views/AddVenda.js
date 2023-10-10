import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import SearchClient from "../components/SearchClient";
import ImeiReader from "../components/ImeiReader";
import { useNavigate } from "react-router-dom";

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
  const [sellDate, setSellDate] = useState();

  //pick Cliente
  const [selectedCliente, setSelectedCliente] = useState(null);

  //IMEI components
  const [imeiArray, setImeiArray] = useState([]);

  const [valorVenda, setValorVenda] = useState(0);

  const [erroImei, setErrorImei] = useState(null);

  const handleImeiAdd = async (imei) => {
    try {
      const getImei = await api.buscarImeiDados(imei);

      // Verifica se o IMEI já existe no imeiArray
      const isImeiAlreadyAdded = imeiArray.some(
        (existingImei) => existingImei.number === getImei.number
      );
      if (!isImeiAlreadyAdded) {
        setImeiArray([
          ...imeiArray,
          {
            ...getImei,
            porcento: "",
            price: calculatePriceFromPorcento(getImei),
          },
        ]);
        // Se não existe, adiciona o IMEI ao imeiArray
      } else {
        setErrorImei("IMEI já foi incluído.");
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

  const formatarValor = (valor) => {
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCliente && imeiArray) {
      try {
        const newVenda = await api.addVenda({
          sellDate,
          selectedCliente, //clienteID
          imeiArray,
          valorVenda,
          userId,
        });
        // Em seguida, limpo o formulário e fecho o modal.
        setSellDate("");
        setSelectedCliente(null);
        setImeiArray([]);
        setValorVenda("");

        setMessage("Venda cadastrada com sucesso!");

        navigate("/vendas/");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } catch (error) {
        console.log(error);
        // setError(error);
      }
    }
  };

  const calculatePriceFromPorcento = (imei) => {
    if (imei.buy_id) {
      const porcento = parseFloat(imei.porcento || 0);
      const newPrice = (imei.buy_id.price * porcento) / 100 + imei.buy_id.price;
      return newPrice;
    }
    return "";
  };

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
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group w-100">
            <SearchClient
              title="Cliente"
              selectedItem={selectedCliente}
              setSelectedItem={setSelectedCliente}
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
                                const newPorcento =
                                  parseFloat(e.target.value) || 0;

                                const updatedImeiArray = [...imeiArray];
                                updatedImeiArray[index].porcento = newPorcento;

                                // Calculate and update the "price" based on the new "porcento"
                                if (imei.buy_id) {
                                  const calculatedPrice =
                                    (imei.buy_id.price * newPorcento) / 100 +
                                    imei.buy_id.price;
                                  updatedImeiArray[index].price = parseFloat(
                                    calculatedPrice.toFixed(2)
                                  );
                                }

                                setImeiArray(updatedImeiArray);
                              }}
                              placeholder="%"
                            />
                          </td>
                          <td className="text-center bg-light">
                            R${" "}
                            <input
                              className="form-control"
                              type="text"
                              value={parseFloat(
                                calculatePriceFromPorcento(imei)
                              )}
                              onChange={(e) => {
                                const updatedImeiArray = [...imeiArray];

                                // Convert the value to a number and update the "price"
                                updatedImeiArray[index].price = parseFloat(
                                  e.target.value
                                );

                                setImeiArray(updatedImeiArray);
                              }}
                              hidden
                            />
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
