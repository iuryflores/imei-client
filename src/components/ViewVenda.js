import React /*, { useState } */ from "react";
// import api from "../utils/api.utils";
// import { useNavigate } from "react-router";

export const ViewVenda = ({ showModalVenda, closeVendaModal, vendaView }) => {
  return (
    <div className={`modal modal-lg ${showModalVenda ? "show" : ""}`}>
      <div
        className="modal-dialog text-dark"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              Venda <b>VEN{vendaView && vendaView.sell_number}</b>
            </h5>
            <div>
              <div
                className="d-flex align-items-center btn btn-outline-info  close"
                onClick={closeVendaModal}
              >
                <span>&times;</span>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div>
              <p>
                Cliente: <b>{vendaView && vendaView.cliente_id.full_name}</b>
              </p>
              <p>
                Vendedor: <b>{vendaView && vendaView.user_sell.full_name}</b>
              </p>
              <p>
                Produtos:{" "}
                <b>
                  {vendaView &&
                    vendaView.imei_id.map((produto, index) => {
                      return (
                        <>
                          {produto.buy_id.produto_id.description} - (
                          {produto.number})
                        </>
                      );
                    })}
                </b>
              </p>
              Cliente: <b>{vendaView && vendaView.cliente_id.full_name}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
