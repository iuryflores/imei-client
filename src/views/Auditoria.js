import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";

export const Auditoria = ({
  loading,
  setLoading,
  loadingGif,
  userId,
  formatarData,
  formatarDataEHora,
}) => {
  const [auditorias, setAuditorias] = useState([]);

  useEffect(() => {
    const getAuditoria = async () => {
      try {
        const data = await api.getAuditorias();
        setAuditorias(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getAuditoria();
  }, []);
  const renderTableRows = () => {
    return auditorias.map((auditoria, index) => {
      let populate = "";
      let entidade = "";
      let className = "";

      switch (auditoria.operacao) {
        case "DELETE":
          className = "danger";
          break;
        case "CADASTRO":
          className = "info";
          break;
        case "LOGIN":
          className = "success";
          break;
        case "ALTERA":
          className = "warning";
          break;
        default:
          className = "";
      }

      const dataAud = formatarDataEHora(auditoria.createdAt);

      switch (true) {
        case !!auditoria.buy_id:
          populate = "COM" + auditoria.buy_id.buy_number;
          entidade = "COMPRAS";
          break;

        case !!auditoria.cliente_id:
          populate =
            auditoria.cliente_id.full_name +
            " (" +
            auditoria.cliente_id.document +
            ")";
          entidade = "CLIENTES";
          break;

        case !!auditoria.sell_id:
          populate =
            "- " +
            auditoria.sell_id.cliente_id.full_name +
            " (" +
            auditoria.sell_id.cliente_id.document +
            ")";
          entidade = "VENDAS";
          break;

        case !!auditoria.user_id_changed:
          populate = auditoria.user_id_changed.full_name;
          entidade = "USUÁRIOS";
          break;

        case !!auditoria.caixa_id && !!auditoria.user_id:
          populate = auditoria.caixa_id.name;
          entidade = "CAIXAS";
          break;

        case !!auditoria.user_id && !auditoria.caixa_id:
          populate = "Fez login";
          entidade = "USUÁRIOS";
          break;

        default:
          populate = null;
          entidade = null;
          break;
      }

      if (!auditoria.imei_id || !auditoria.imei_id === null) {
        return (
          <tr key={index} className={`table-${className}`}>
            <td className="text-center">{dataAud}h</td>
            <td>{auditoria.operacao}</td>
            <td>{entidade}</td>
            <td>{populate}</td>
            <td>{auditoria.user_id.full_name}</td>
          </tr>
        );
      }
      return null;
    });
  };

  return (
    <div className="p-3 m-3 d-flex flex-column align-items-center">
      <h1>Ações do sistema</h1>
      {!loading ? (
        <div className="border p-2 shadow rounded w-100">
          <table className="table mb-0 table-striped table-hover">
            <thead>
              <tr>
                <th className="text-center">Data</th>
                <th>Operação</th>
                <th>Entidade</th>
                <th>Descrição</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.length > 0 ? (
                renderTableRows()
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Nenhuma ação feita no sistema!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <img style={{ width: "100px" }} src={loadingGif} alt="Loading gif" />
        </div>
      )}
    </div>
  );
};
