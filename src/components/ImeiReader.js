import React, { useState, useEffect, useRef } from "react";

const ImeiReader = ({ onImeiAdd }) => {
  const [imei, setImei] = useState("");
  const [serial, setSerial] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imei) {
        onImeiAdd(imei, serial);
        setImei("");
        setSerial("");
      }
    }, 1000); // Aguarde segundos após a última alteração

    return () => clearTimeout(timer);
  }, [imei, onImeiAdd]);

  const inputRef = useRef(null);

  const handleImeiChange = (event) => {
    setImei(event.target.value);
    setSerial(serial);
    inputRef.current.focus();
  };

  return (
    <div className="d-flex justify-content-between flex-wrap">
      <div className="form-group col-12 col-md-4">
        <label>Outro Serial:</label>
        <input
          className="form-control"
          type="number"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder=""
        />
      </div>
      <div className="form-group col-12 col-md-7">
        <label>Leitura de IMEI/Serial:</label>
        <input
          className="form-control"
          type="number"
          value={imei}
          onChange={handleImeiChange}
          placeholder="Insira o IMEI aqui!"
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default ImeiReader;
