import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import SearchClient from "../components/SearchClient";
import ImeiReader from "../components/ImeiReader";
import SearchProdutoVenda from "../components/SearchProdutoVenda";
import { useNavigate } from "react-router-dom";

const AddVenda = ({
  message,
  setMessage,
  error,
  setError,
  userId,
  updateVendaList,
  newVenda,
  userData,
  loadin,
  setLoading,
}) => {
  //formulario de registro da venda
  const [sellDate, setSellDate] = useState();

  //pick Cliente
  const [selectedCliente, setSelectedCliente] = useState(null);

  //select produto sem imei
  const [selectedProduto, setSelectedProduto] = useState(null);

  //IMEI components
  const [imeiArray, setImeiArray] = useState([]);

  const [semImeiArray, setSemImeiArray] = useState([]);

  const [valorVenda, setValorVenda] = useState(0);

  const [erroImei, setErrorImei] = useState(null);

  const [dataPagamento, setDataPagamento] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");

  const handleImeiAdd = async (imei) => {
    try {
      const getImei = await api.buscarImeiDados(imei);

      if (getImei) {
        setErrorImei(null);
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
          setErrorImei("IMEI já foi incluso na lista");
        }
      } else {
        setErrorImei("Erro ao buscar IMEI");
      }
    } catch (error) {
      setErrorImei(error);
      console.error(error);
    }
  };

  //add sem imei
  const handleSemImeiAdd = async (produto) => {
    try {
      setSemImeiArray([...semImeiArray]);
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

  //remove Sem Imei
  const removeSemImei = (index) => {
    const updatedSemImeiArray = [...semImeiArray];
    updatedSemImeiArray.splice(index, 1);
    setSemImeiArray(updatedSemImeiArray);
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

    if (selectedCliente !== null) {
      if (formaPagamento !== "") {
        try {
          const idCaixa = caixaDiario._id;
          await api.addVenda({
            sellDate,
            selectedCliente, //clienteID
            imeiArray,
            semImeiArray,
            valorVenda,
            userId,
            userData,
            dataPagamento,
            formaPagamento,
            idCaixa,
          });
          // Em seguida, limpo o formulário e fecho o modal.
          setSellDate("");
          setSelectedCliente(null);
          setImeiArray([]);
          setValorVenda("");

          setMessage("Venda cadastrada com sucesso!");

          navigate("/");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        } catch (error) {
          console.log(error);
          setError(error);
        }
      } else {
        setError("Forma de pagamento é obrigatória!");
      }
    } else {
      setError("Necessário informar o cliente e ao menos 01 IMEI");
    }
  };

  const calculatePriceFromPorcento = (imei) => {
    if (imei && imei.buy_id) {
      const porcento = parseFloat(imei.porcento || 0);
      const newPrice = (imei.buy_id.price * porcento) / 100 + imei.buy_id.price;
      return newPrice;
    }
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

  useEffect(() => {
    setTimeout(() => {
      setErrorImei(null);
    }, 3000);
  });

  const [selectedDate] = useState(getCurrentFormattedDate());

  function getCurrentFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Pad the month and day with leading zeroes if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  const [caixaDiario, setCaixaDiario] = useState(null);

  useEffect(() => {
    const getCaixa = async () => {
      try {
        setLoading(true);

        if (selectedDate) {
          const getCaixaDia = await api.checkCaixaAberto(selectedDate);
          setCaixaDiario(getCaixaDia);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userData) {
      getCaixa();
    }
    setLoading(false);
  }, [selectedDate, userData]);

  const [hasImei, setHasImei] = useState("nao");

  const handleImei = (e) => {
    setHasImei(e.target.value);
  };

  // const [seeStore, setSeeStore] = useState(false);

  // const handleSeeStore = () => {
  //   setSeeStore(!seeStore);
  // };

  const [estoque, setEstoque] = useState(null);

  // let statusEstoque = "";
  // if (seeStore !== true) {
  //   statusEstoque = "Ver";
  // } else {
  //   statusEstoque = "Fechar";
  // }

  useEffect(() => {
    const getEstoque = async () => {
      try {
        const allEstoque = await api.getProdutos();
        setEstoque(allEstoque);
      } catch (error) {
        console.log(error);
      }
    };
    getEstoque();
  }, []);
  console.log(imeiArray);
  return (
    <div className="container mt-3">
      <div className="d-flex flex-column mb-3">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Registrando Venda
        </h5>

        <div className="d-flex">
          <div className="d-flex flex-column w-100 p-3">
            <form className="d-flex flex-column ">
              <div className="d-flex flex-wrap justify-content-between">
                <div className="form-group col-12 col-lg-9">
                  <SearchClient
                    title="Cliente"
                    selectedItem={selectedCliente}
                    setSelectedItem={setSelectedCliente}
                  />
                </div>
                <div className="d-flex flex-column col-12 col-lg-2">
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
              </div>

              <div className="w-100 d-flex justify-content-between">
                <div className="w-100">
                  {/* Integre o componente ImeiReader e passe a função de callback */}
                  <ImeiReader onImeiAdd={handleImeiAdd} />
                  {erroImei && (
                    <div className="alert alert-danger">{erroImei}</div>
                  )}

                  <div className="border p-2 rounded bg-light mb-3">
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
                          <th style={{ width: "10%" }}>Preço</th>
                          <th style={{ width: "10%", textAlign: "center" }}>
                            %
                          </th>
                          <th style={{ width: "10%", textAlign: "center" }}>
                            Valor de Venda
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
                              <td>{imei.number && imei.number}</td>
                              <td>
                                {imei.buy_id &&
                                  imei.buy_id.produto_id.description}
                              </td>
                              <td>
                                R${" "}
                                {imei.buy_id &&
                                  formatarValor(imei.buy_id.price)}
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
                                    updatedImeiArray[index].porcento =
                                      newPorcento;

                                    // Calculate and update the "price" based on the new "porcento"
                                    if (imei.buy_id) {
                                      const calculatedPrice =
                                        (imei.buy_id.price * newPorcento) /
                                          100 +
                                        imei.buy_id.price;
                                      updatedImeiArray[index].price =
                                        parseFloat(calculatedPrice.toFixed(2));
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
                                {imei &&
                                  imei.buy_id &&
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
              <hr />
              <div className="w-100 d-flex justify-content-between">
                <div className="form-group">
                  <label htmlFor="hasImei">
                    Deseja incluir algum produto que não tem IMEI/Serial?
                  </label>
                  <div>
                    <input
                      type="radio"
                      id="hasImei"
                      name="hasImei"
                      value="sim"
                      checked={hasImei === "sim"}
                      onChange={handleImei}
                    ></input>
                    <label htmlFor="sim" className="mx-3">
                      Sim
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="hasImei"
                      name="hasImei"
                      value="nao"
                      checked={hasImei === "nao"}
                      onChange={handleImei}
                    ></input>
                    <label htmlFor="nao" className="mx-3">
                      Não
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-100 d-flex justify-content-between">
                {hasImei === "sim" ? (
                  <>
                    <SearchProdutoVenda
                      selectedProduto={selectedProduto}
                      setSelectedProduto={setSelectedProduto}
                      setError={setError}
                      error={error}
                    />
                  </>
                ) : null}
              </div>
              <div className="w-100 d-flex justify-content-between">
                <div className="form-group col-md-2">
                  <label htmlFor="dataPagamento">Data de Pagamento</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dataPagamento"
                    name="dataPagamento"
                    value={dataPagamento}
                    onChange={(e) => setDataPagamento(e.target.value)}
                  />
                </div>

                <div className="form-group col-md-8">
                  <label htmlFor="formaPagamento">Forma de Pagamento</label>
                  <select
                    className="form-control"
                    id="formaPagamento"
                    name="formaPagamento"
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  >
                    <option value="">Selecione a forma de pagamento</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="transferencia_bancaria">
                      Transferência Bancária
                    </option>
                  </select>
                </div>
              </div>
            </form>
            {error ? (
              <div className="alert alert-danger text-center">
                <b>{error}</b>
              </div>
            ) : null}

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
          {/*seeStore && (
            <div className="d-flex flex-column w-50 align-items-center p-3 table-estoque-venda radios-5">
              <div className="text-center">
                <h5>Estoque</h5>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>IMEI</th>
                  </tr>
                </thead>
                <tbody>
                  {estoque &&
                    estoque.map((item, index) => (
                      <tr key={index}>
                        <td>{item.buy_id.description}</td>
                        <td>IMEI:{item.number}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
                    )*/}
        </div>
      </div>
    </div>
  );
};

export default AddVenda;
