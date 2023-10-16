import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";

const MeuCaixa = ({
  message,
  setMessage,
  loading,
  setLoading,
  loadingGif,
  userId,
  userData,
}) => {
  const [caixas, setCaixas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getCurrentFormattedDate());

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

  useEffect(() => {
    const getCaixa = async () => {
      try {
        if (selectedDate) {
          const getCaixaDia = await api.getCaixaDia(
            selectedDate,
            userData.caixa_id
          );
          setCaixas(getCaixaDia);
          console.log(getCaixaDia);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCaixa();
  }, [selectedDate]);

  console.log(caixas);

  const renderTable = () => {
    if (loading === false) {
      if (caixas.length > 0) {
        return (
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th>Data (compra)</th>
                <th>IMEI's</th>
                <th>Valor (compra)</th>
              </tr>
            </thead>
            <tbody>
              {caixas.map((caixa, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        return (
          <div className="text-center text-dark">
            Nenhum lançamento registrado!
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
    <div className="p-3 m-3  d-flex flex-column">
      <div className="d-flex align-items-baseline justify-content-between">
        <h1>
          <i className="bi bi-cash-coin"></i> Caixa
        </h1>
        <div className="mb-3">
          <input
            className="form-control"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <div className="d-flex align-items-center alert alert-info">
            <span>
              Caixa: <b>R$ {}</b>
            </span>
          </div>
        </div>
      </div>
      <hr />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="border p-2  shadow rounded w-100">{renderTable()}</div>
    </div>
  );
};

export default MeuCaixa;
