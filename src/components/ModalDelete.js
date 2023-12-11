import React from "react";

export const ModalDelete = ({
  showModalDelete,
  onClose,
  deleteCompra,
  currentCompra,
  currentCompraID,
}) => {
  return (
    <div className={`modal  ${showModalDelete ? "show" : ""}`}>
      <div
        className="modal-dialog text-dark"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <div></div>
          </div>
          <div className="modal-body">
            <h5 className="modal-title">
              Tem certeza que deseja deletar{" "}
              <b>COM{currentCompra.buy_number}</b>?
            </h5>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => deleteCompra(currentCompraID)}
            >
              Sim
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
