import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import InputMask from "react-input-mask";

export const ModalEditCompra = ({ show, onClose, compraID }) => {
  const [compra, setCompra] = useState("");

  const [price, setPrice] = useState(0);
  const [priceDb, setPriceDb] = useState(0);

  const [priceVenda, setPriceVenda] = useState(0);
  const [priceVendaDb, setPriceVendaDb] = useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      const getProdutoData = async () => {
        try {
          const getProduto = await api.getProdutoID(compraID);
          setCompra(getProduto);
          setPrice(
            getProduto.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })
          );
          setPriceVenda(
            getProduto.sellPrice.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })
          );
        } catch (error) {
          console.log(error);
        }
      };
      getProdutoData();
    }
  }, [compraID]);

  const handleSubmit = async (e) => {
    const { _id } = compra;
    e.preventDefault();
    try {
      const editProd = await api.addPriceProduto(_id, {
        priceDb,
        priceVendaDb,
      });
      if (editProd) {
        onClose();
      }
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };
  const handleValorChange = (e) => {
    const inputValor = e.target.value;
    const valorNumerico = parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;

    setPriceDb(valorNumerico);

    if (!isNaN(valorNumerico)) {
      setPrice(
        valorNumerico.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setPrice("");
    }
  };
  const handleValorVendaChange = (e) => {
    const inputValor = e.target.value;

    const valorNumericoVenda =
      parseFloat(inputValor.replace(/[^0-9]/g, "")) / 100;

    setPriceVendaDb(valorNumericoVenda);

    if (!isNaN(valorNumericoVenda)) {
      setPriceVenda(
        valorNumericoVenda.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setPrice("");
    }
  };

  useEffect(() => {
    const formattedPrice = price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
    const formattedPriceVenda = priceVenda.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });

    // Setar os valores formatados
    setPrice(formattedPrice);
    setPriceVenda(formattedPriceVenda);
  }, [price, priceVenda]);

  return (
    <div className={`modal modal-lg ${show ? "show" : ""}`}>
      <div
        className="modal-dialog text-dark"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              Adicionando valor à compra <b>COM{compra.buy_number}</b>
            </h5>
            <div>
              <div
                className="d-flex align-items-center btn btn-outline-info  close"
                onClick={onClose}
              >
                <span>&times;</span>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <form>
              {error ? <div className="alert alert-danger">{error}</div> : null}

              <div className="form-group">
                <label htmlFor="value">Valor</label>
                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="price"
                  name="price"
                  value={price}
                  placeholder="0,00"
                  onChange={handleValorChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="value">Valor de venda</label>
                <InputMask
                  mask=""
                  maskChar=""
                  alwaysShowMask={false}
                  id="priceVenda"
                  name="priceVenda"
                  value={priceVenda}
                  placeholder="0,00"
                  onChange={handleValorVendaChange}
                  className="form-control"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
