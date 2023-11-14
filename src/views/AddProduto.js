import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

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

    if (formData.description && formData.brand) {
      try {
        const newProduto = await api.addProduto({
          formData,
          hasImei,
          valorCompraDb,
          valorVendaDb,
          userId,
        });
        if (newProduto) {
          setFormData({
            description: "",
            brand: "",
            valorCompra: "",
            valorVenda: "",
          });
          setMessage("Produto cadastrado com sucesso!");
          navigate("/estoque/");
        }
      } catch (error) {
        const newError = error.trim().split(" ");

        if (newError[0] === "E11000") {
          setError("Essa descrição já foi cadastrada!");
        } else {
          setError(error);
        }
      }
    } else {
      setError("É necessário informar Descrição e Marca.");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 4000);
  }, []);

  const [valorCompra, setValorCompra] = useState(null);
  const [valorVenda, setValorVenda] = useState(null);

  const handleValorChange = (e) => {
    const inputValor = e.target.value;
    const valorNumerico = parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;

    setValorCompraDb(valorNumerico);

    if (!isNaN(valorNumerico)) {
      setValorCompra(
        valorNumerico.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setValorCompra("");
    }
  };

  const [valorVendaDb, setValorVendaDb] = useState(0);
  const [valorCompraDb, setValorCompraDb] = useState(0);

  const handleValorVendaChange = (e) => {
    const inputValor = e.target.value;

    const valorNumericoVenda =
      parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;

    setValorVendaDb(valorNumericoVenda);

    if (!isNaN(valorNumericoVenda)) {
      setValorVenda(
        valorNumericoVenda.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setValorVenda("");
    }
  };

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column">
        <hr className="espacamento-02" />
        <h5 className="mt-3">
          <i className="bi bi-cash-coin"></i> Cadastrando Produto
        </h5>

        <form className="d-flex flex-wrap  justify-content-between">
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
          <div className="form-group col-12 col-lg-4">
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
            <>
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
              <div className="col-12 col-lg-2">
                <label htmlFor="brand">Valor de compra:</label>
                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="valorCompra"
                  name="valorCompra"
                  value={valorCompra}
                  placeholder="0,00"
                  onChange={handleValorChange}
                  className="form-control"
                />
              </div>
              <div className="col-12 col-lg-2">
                <label htmlFor="brand">Valor de venda:</label>
                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="valorVenda"
                  name="valorVenda"
                  value={valorVenda}
                  placeholder="0,00"
                  onChange={handleValorVendaChange}
                  className="form-control"
                />
              </div>
            </>
          ) : null}
        </form>
        {error && (
          <div className="alert alert-danger text-center">
            <strong>{error}</strong>
          </div>
        )}
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
