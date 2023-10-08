import React, { useState, useEffect } from "react";

const ImeiReader = ({ onImeiAdd }) => {
  const [imei, setImei] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imei) {
        onImeiAdd(imei);
        setImei("");
      }
    }, 1000); // Aguarde 3 segundos após a última alteração

    return () => clearTimeout(timer);
  }, [imei, onImeiAdd]);

  const handleImeiChange = (event) => {
    setImei(event.target.value);
  };


  return (
    <div className="d-flex flex-column form-group">
      <label>Leitura de IMEI</label>
      <input
        className="form-control"
        type="number"
        value={imei}
        onChange={handleImeiChange}
        placeholder="Insira o IMEI"
      />
    </div>
  );
};

export default ImeiReader;
