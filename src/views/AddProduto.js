import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";

const AddProduto = ({ message, setMessage, userId }) => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [hasImei, setHasImei] = useState("sim");

  //formulario de registro da compra
  const [formData, setFormData] = useState({
    description: "",
    brand: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImei = (e) => {
    setHasImei(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData) {
      try {
        const newProduto = await api.addProduto({
          formData,
          hasImei,
          userId,
        });
        if (newProduto) {
          setFormData({
            description: "",
            brand: "",
          });
          setMessage("Produto cadastrado com sucesso!");
          navigate("/estoque/");
        }
      } catch (error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 4000);
  }, []);

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Cadastrando Produto
        </h5>

        <form className="d-flex flex-wrap">
          <div className="form-group col-12">
            <label htmlFor="description">Descrição:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              placeholder="Ex. iPhone 12 Pro Max 256GB"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col-12">
            <label htmlFor="brand">Marca:</label>
            <input
              type="text"
              className="form-control"
              id="brand"
              name="brand"
              placeholder="Ex. Apple"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-12 col-lg-4 ">
            <label htmlFor="hasImei">O produto possui IMEI/Serial?</label>
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
          {hasImei !== "sim" ? (
            <div className="col-12 col-lg-1">
              <label htmlFor="brand">Quantidade:</label>
              <input
                type="number"
                className="form-control"
                id="qtd"
                name="qtd"
                value={formData.qtd}
                onChange={handleChange}
              />
            </div>
          ) : null}

          {error && <div className="alert alert-danger">{error}</div>}
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
export default AddProduto;
