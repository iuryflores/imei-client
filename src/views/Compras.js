import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { CompraAdd } from "../components/CompraAdd.js";

export const Compras = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
  loadingGif,
  userId,
  openModal,
  showModal,
  closeModal,
}) => {
  const [compras, setCompras] = useState([]);

  const updateCompraList = (newCompra) => {
    setCompras([...compras, newCompra]);
  };

  useEffect(() => {
    const getCompras = async () => {
      try {
        setMessage("")
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

  const renderTable = () => {
    if (loading === false) {
      if (compras.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data</th>
                <th>Fornecedor</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Valor (unitário)</th>
                <th>Valor (total)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra, index) => {
                const valorTotalCompra = compra.imei_id.length * compra.price;

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
                    <td className="capitalize">
                      {compra.fornecedor_id.type === "juridica" ? (
                        <i className="bi bi-building-fill"></i>
                      ) : (
                        <i className="bi bi-person-fill"></i>
                      )}{" "}
                      {compra.fornecedor_id.full_name} (
                      {compra.fornecedor_id.document})
                    </td>
                    <td>{compra.description}</td>
                    <td>{compra.imei_id.length}</td>
                    <td style={{ width: "fit-content" }}>
                      R$ {formatarValorMonetario(compra.price)}
                    </td>
                    <td style={{ width: "fit-content" }}>
                      R$ {formatarValorMonetario(valorTotalCompra)}
                    </td>
                    <td>
                      <div
                        className="btn btn-outline-danger"
                        onClick={() => {
                          deleteCompra(compra._id);
                        }}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        return <div className="text-center">Nenhuma compra registrada!</div>;
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
          <div
            className="d-flex align-items-center btn btn-outline-info"
            onClick={openModal}
          >
            <span>Adicionar</span>
            <i className="bi bi-plus-circle-fill mx-1 fs-6"></i>
          </div>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2 shadow rounded w-100">{renderTable()}</div>
      {/* Modal de cadastro de cliente */}
      <CompraAdd
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
        updateCompraList={updateCompraList}
      />
    </div>
  );
};
