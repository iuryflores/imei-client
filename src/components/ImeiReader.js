import React, { useState, useEffect, useRef } from "react";

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

  const inputRef = useRef(null);

  const handleImeiChange = (event) => {
    setImei(event.target.value);
    inputRef.current.focus();
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
        ref={inputRef}
      />
    </div>
  );
};

export default ImeiReader;
