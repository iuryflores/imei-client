import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.utils";

const ViewCaixa = ({
  setError,
  setMessage,
  loading,
  setLoading,
  loadingGif,
  userId,
  userData,
}) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [caixaDataEdit, setCaixaDataEdit] = useState({
    status: false,
    name: "",
    data_inicio: "",
    saldo_inicial: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataFromDB = await api.getCaixaData(id);
        setCaixaDataEdit(userDataFromDB);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar os dados do caixa:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    let newValue;

    if (type === "checkbox") {
      newValue = event.target.checked;
    } else if (name === "status") {
      newValue = value === "true";
    } else {
      newValue = value;
    }

    setCaixaDataEdit({
      ...caixaDataEdit,
      [name]: newValue,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (caixaDataEdit) {
      try {
        await api.editCaixa({ caixaDataEdit, userId });
        setMessage("Caixa alterado com sucesso!");
        navigate("/caixas/");
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <div>
      <div className="container mt-3">
        <div className="mx-3">
          <h4>
            <i className="bi bi-people-fill"></i> Editando Caixa
          </h4>
        </div>
        <hr />
      </div>
      {!loading ? (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-row d-flex mt-3 align-items-center">
              <div className="form-group col-md-10">
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={caixaDataEdit.name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-2">
                <label className="mr-2 d-flex flex-column align-items-center">
                  Ativo?
                  <input
                    type="checkbox"
                    className="form-check-input ml-2"
                    name="status"
                    checked={caixaDataEdit.status}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>
            <div className="form-row d-flex">
              <div className="form-group col-md-2">
                <label>
                  Data de Início:
                  <input
                    type="date"
                    className="form-control"
                    name="data_inicio"
                    value={caixaDataEdit.data_inicio}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="form-group col-md-2">
                <label>
                  Saldo Inicial:
                  <input
                    type="number"
                    className="form-control"
                    name="saldo_inicial"
                    value={caixaDataEdit.saldo_inicial}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Salvar Alterações
            </button>
          </form>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <img style={{ width: "100px" }} src={loadingGif} alt="Loading gif" />
        </div>
      )}
    </div>
  );
};

export default ViewCaixa;
