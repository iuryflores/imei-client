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
      } catch (error) {
        console.log(error);
      }
    };
    getAuditoria();
  }, []);

  const renderTableRows = () => {
    return auditorias.map((auditoria, index) => {
      let populate = "";

      const dataAud = formatarData(auditoria.createdAt);

      switch (true) {
        case !!auditoria.fornecedor_id:
          populate =
            "- " +
            auditoria.fornecedor_id.full_name +
            " (" +
            auditoria.fornecedor_id.document +
            ")";
          break;
        case !!auditoria.cliente_id:
          populate =
            "- " +
            auditoria.cliente_id.full_name +
            " (" +
            auditoria.cliente_id.document +
            ")";
          break;

        case !!auditoria.buy_id:
          populate =
            "- " +
            auditoria.buy_id.fornecedor_id.full_name +
            " (" +
            auditoria.buy_id.fornecedor_id.document +
            ")";
          break;

        case !!auditoria.sell_id:
          populate =
            "- " +
            auditoria.sell_id.full_name +
            " (" +
            auditoria.buy_id.fornecedor_id.document +
            ")";
          break;
        default:
          populate = null;
          break;
      }
      if (!auditoria.imei_id || !auditoria.imei_id === null) {
        return (
          <tr key={index}>
            <td className="text-center">{dataAud}</td>
            <td>{auditoria.operacao}</td>
            <td>
              {auditoria.descricao} {populate}
            </td>
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

      <div className="border p-2 shadow rounded w-100">
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th className="text-center">Data</th>
              <th>Operação</th>
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
    </div>
  );
};
