import React, { useState } from "react";
import api from "../utils/api.utils";

export const ModalEditProduto = ({
  show,
  onClose,
  error,
  selectedProduto,
  setSelectedProduto,
  updateProductName,
}) => {
  const [description, setDescription] = useState(selectedProduto.description);

  const handleSubmit = async (e) => {
    const produtoID = selectedProduto._id;
    e.preventDefault();
    try {
      const editProd = await api.editProduto(produtoID, { description });
      if (editProd) {
        setSelectedProduto((prevSelectedProduto) => ({
          ...prevSelectedProduto,
          description: description,
        }));
        updateProductName(produtoID, description);

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
            <h5 className="modal-title">Editando produto</h5>
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
                <label htmlFor="name">Descrição do produto</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
