import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { Link } from "react-router-dom";
import { ModalEditCompra } from "../components/ModalEditCompra";

export const Compras = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
  loadingGif,
  userData,
  openModal,
  showModal,
  closeModal,
}) => {
  const [compras, setCompras] = useState([]);

  const [compraID, setCompraID] = useState("");

  useEffect(() => {
    const getCompras = async () => {
      try {
        setMessage("");
        const getAllCompras = await api.getAllCompras();
        setCompras(getAllCompras);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching compras:", error);
      }
    };

    getCompras();
  }, [loading, setLoading]);

  const formatarValorMonetario = (valor) => {
    // Converte o valor para string
    const valorString = valor.toString();
    if (valorString.includes(".")) {
      // Separar os centavos
      const separado = valorString.split(".");
      let centavos = separado[1];
      if (centavos.length === 1) {
        centavos = centavos + "0";
      }

      // Reverter a string e agrupar os milhares de três em três
      const parteAntesDaVirgula = separado[0].split(".").join("");
      const reais = parteAntesDaVirgula.slice(-3); // Pegar os 3 últimos dígitos antes da vírgula
      let milhares = parteAntesDaVirgula.slice(0, -3); // Pegar os milhares

      let total = "";
      if (milhares && reais) {
        total = milhares + "." + reais + "," + centavos;
      } else if (!milhares && reais) {
        total = reais + "," + centavos;
      } else {
        total = 0 + "," + centavos;
      }

      return total;
    } else {
      let reais = "";
      let milhares = "";
      if (valorString.length > 3) {
        reais = valorString.slice(-3); // Pegar os milhares
        milhares = valorString.slice(0, -3);
        let total = milhares + "." + reais + ",00";
        return total;
      } else {
        return valorString + ",00";
      }
    }
  };

  const deleteCompra = async (compra_id) => {
    try {
      setLoading(true);
      const deleteCompra = await api.deleteCompra({ compra_id });
      setLoading(false);
      setMessage(deleteCompra.msg);

      // Remove the deleted venda from the list
      setCompras((prevCompras) =>
        prevCompras.filter((compra) => compra._id !== compra_id)
      );

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const editCompra = async (compra_id) => {
    setCompraID(compra_id);
    console.log(compraID);
    openModal(true);
  };

  const renderTable = () => {
    if (loading === false) {
      if (compras.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data</th>
                <th>Nº da compra</th>
                <th>Fornecedor</th>
                <th>Produto</th>
                <th>Qtd</th>
                {/* <th>Valor (unitário)</th> */}
                <th>Valor (total)</th>
                <th>Comprador(a)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra, index) => {
                const valorTotalCompra = compra.imei_id.length * compra.price;
                const comprador =
                  compra.user_buy && compra.user_buy.full_name.split(" ");

                return (
                  <tr
                    key={index}
                    className="clickable"
                    style={{ verticalAlign: "middle" }}
                  >
                    <td>
                      {new Date(compra.dateBuy).toLocaleDateString("pt-br", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>COM{compra.buy_number || ""}</td>
                    <td className="capitalize">
                      {compra.fornecedor_id.type === "juridica" ? (
                        <i className="bi bi-building-fill"></i>
                      ) : (
                        <i className="bi bi-person-fill"></i>
                      )}{" "}
                      {compra.fornecedor_id.full_name} (
                      {compra.fornecedor_id.document})
                    </td>
                    <td>
                      {compra.produto_id && compra.produto_id.description}
                    </td>
                    <td>{(compra.produto_id && compra.produto_id.qtd) || 0}</td>
                    {/* <td style={{ width: "fit-content" }}>
                      R$ {formatarValorMonetario(compra.price)}
                    </td> */}
                    <td style={{ width: "fit-content" }}>
                      R$ {formatarValorMonetario(valorTotalCompra)}
                    </td>
                    <td>{compra.user_buy && comprador[0]}</td>
                    <td>
                      {userData.admin ? (
                        <>
                          <div
                            className="btn btn-warning mx-1"
                            onClick={() => {
                              editCompra(compra._id);
                            }}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </div>
                          <div
                            className="btn btn-danger"
                            onClick={() => {
                              deleteCompra(compra._id);
                            }}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </div>
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        return (
          <div className="text-center text-dark alert alert-warning">
            Nenhuma compra registrada!
          </div>
        );
      }
    } else {
      return (
        <div className="d-flex justify-content-center">
          <img style={{ width: "100px" }} src={loadingGif} alt="Loading gif" />
        </div>
      );
    }
  };

  return (
    <div className="p-3 m-3 d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h1>Compras</h1>
        <div className="mb-3">
          <Link
            className="d-flex align-items-center btn btn-outline-info"
            to="/compras/cadastrando/"
          >
            <span>Adicionar</span>
            <i className="bi bi-plus-circle-fill mx-1 fs-6"></i>
          </Link>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2 shadow rounded w-100">{renderTable()}</div>
      {/* Modal de edit produto */}
      <ModalEditCompra
        show={showModal}
        onClose={closeModal}
        error={error}
        setError={setError}
        userData={userData}
        compraID={compraID}
      />
    </div>
  );
};
