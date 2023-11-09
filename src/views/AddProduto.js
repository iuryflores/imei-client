import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";

const AddProduto = ({ message, setMessage, userId }) => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData) {
      try {
        const newProduto = await api.addProduto({
          formData,
          userId,
        });
        if (newProduto) {
          setFormData({
            description: "",
            brand: "",
          });
          setMessage("Produto cadastrado com sucesso!");
          navigate("/produtos/");
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

        <form className="d-flex flex-column align-items-end">
          <div className="form-group w-100">
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

          <div className="form-group w-100">
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
