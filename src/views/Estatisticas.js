import React from "react";
import { Link } from "react-router-dom";

const Estatisticas = () => {
  return (
    <div className="container p-3">
      <h5>Estatísticas</h5>
      <hr />
      <div className="divs-estat">
        <Link to={"/estatisticas/compras/"}>
          <i className="bi bi-bag-fill"></i>COMPRAS
        </Link>
        <Link to={"/estatisticas/vendas/"}>
          <i className="bi bi-cart-check-fill"></i>VENDAS
        </Link>
        <Link to={"/estatisticas/relatorios/"}>
          <i className="bi bi-bar-chart-line-fill"></i>RELATÓRIOS
        </Link>
      </div>
    </div>
  );
};

export default Estatisticas;
