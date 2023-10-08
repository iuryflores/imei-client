import React, { /*useEffect,*/ useState } from "react";
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
  const [ setBuyData] = useState([]);
  const [porcento, setPorcento] = useState("");
  // const [lucro, setLucro] = useState("");

  const [erroImei, setErrorImei] = useState(null);
  const handleImeiAdd = async (imei) => {
    try {
      const getImei = await api.buscarImeiDados(imei);

      // Verifica se o IMEI já existe no imeiArray
      const isImeiAlreadyAdded = imeiArray.some(
        (existingImei) => existingImei.number === getImei.number
      );

      if (!isImeiAlreadyAdded) {
        setImeiArray([...imeiArray, getImei]);
        // Se não existe, adiciona o IMEI ao imeiArray
      } else {
        setErrorImei("IMEI já foi incluído.");
      }
      setBuyData(getImei);
    } catch (error) {
      setErrorImei(error);
      console.log(error);
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
    const valorFormatado = valor.toLocaleString("pt-BR");
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

  console.log(porcento);

  return (
    <div className="container mt-3">
      <div className="">
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
                        style={{ backgroundColor: "grey", borderRadius:"5px 5px 0 0" }}
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
                    {imeiArray.map((imei, index) => (
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
                        <td>{imei.buy_id.description}</td>
                        <td>R$ {formatarValor(imei.buy_id.price)},00</td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={porcento}
                            onChange={(e) => setPorcento(e.target.value)}
                            placeholder="Lucro/Desconto"
                          />
                        </td>
                        <td className="text-center bg-light">
                          R${" "}
                          {(imei.buy_id.price * porcento) / 100 +
                            imei.buy_id.price}
                          ,00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
};

export default AddVenda;
