import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.utils";

const ViewUser = ({
  error,
  setError,
  message,
  setMessage,
  loading,
  setLoading,
  loadingGif,

  userId,
  userData,
}) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [userDataEdit, setUserDataEdit] = useState({
    full_name: "",
    cpf: "",
    email: "",
    senha: "",
    caixa_id: "",
  });

  const [caixas, setCaixas] = useState([]);

  useEffect(() => {
    // Carrega os dados do usuário do banco de dados ao inicializar o componente
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Chame a função do apiUtil para buscar os dados do usuário
        const userDataFromDB = await api.getUserNav(id);

        setUserDataEdit(userDataFromDB);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      }
    };

    // Carrega a lista de caixas do banco de dados ao inicializar o componente
    const fetchCaixas = async () => {
      try {
        // Chame a função do apiUtil para buscar as caixas
        const caixasData = await api.getCaixasAtivos();
        setCaixas(caixasData);
      } catch (error) {
        console.error("Erro ao buscar as caixas:", error);
      }
    };

    fetchUserData();
    fetchCaixas();
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDataEdit({
      ...userDataEdit,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.editUser({ userDataEdit, userId });
      setMessage("Usuário alterado com sucesso!");
      navigate("/usuarios/");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <div className="container mt-3">
        <div className="mx-3">
          <h4>
            <i className="bi bi-people-fill"></i> Editando usuário
          </h4>
        </div>
        <hr />
      </div>
      {!loading ? (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={userDataEdit.full_name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={userDataEdit.cpf}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDataEdit.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Nova Senha:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userDataEdit.password}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="caixa">Caixa:</label>

              {caixas.length === 0 ? (
                <div>Necessário cadastrar Caixas</div>
              ) : (
                <select
                  id="caixa_id"
                  name="caixa_id"
                  value={userDataEdit.caixa_id || ""}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value={""}>Selecione uma opção</option>

                  {caixas.map((caixa) => (
                    <option key={caixa._id} value={caixa._id}>
                      {caixa.name}
                    </option>
                  ))}
                </select>
              )}
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

export default ViewUser;
