import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";

export const ModalEditCompra = ({ show, onClose, compraID }) => {
  const [compra, setCompra] = useState("");

  const [value, setValue] = useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      const getProdutoData = async () => {
        try {
          const getProduto = await api.getProdutoID(compraID);
          setCompra(getProduto);
          setValue(getProduto.price);
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
        value,
      });
      if (editProd) {
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`modal modal-lg ${show ? "show" : ""}`}>
      <div
        className="modal-dialog text-dark"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              Editando compra COM{compra.buy_number}
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
                <input
                  type="text"
                  className="form-control"
                  id="value"
                  name="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
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
