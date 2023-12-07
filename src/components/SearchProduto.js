import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";
import { ModalEditProduto } from "./ModalEditProduto";

const SearchProduto = ({
  title,
  selectedProduto,
  setSelectedProduto,
  setError,
  error,
  openModal,
  showModal,
  closeModal,
  userData,
}) => {
  const updateProductName = (productId, newName) => {
    setResults((prevResults) =>
      prevResults.map((result) =>
        result._id === productId
          ? { ...result, description: newName }
          : result
      )
    );
  };


  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await api.buscaProduto(searchTerm);
        setResults(data);
      } catch (error) {
        setError(error);
      }
    };

    if (searchTerm) {
      fetchSuggestions();
    } else {
      setResults([]);
    }
  }, [searchTerm, title, selectedProduto]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedProduto(null); // Limpa o item selecionado quando o usuário digita
    setError(null);
  };

  const handleSelectItem = (item) => {
    setError(null);
    setSelectedProduto(item);
    setShowProduto(false);
    setSearchTerm(""); // Limpa o termo de pesquisa quando um item é selecionado
  };

 

  const [showProduto, setShowProduto] = useState(true);

  const cleanProduto = () => {
    setShowProduto(true);
    setSelectedProduto(null);
  };

  return (
    <div>
      {showProduto ? (
        <>
          <label>Produto</label>
          <input
            type="text"
            className="form-control"
            placeholder={`Digite o produto`}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {results.length > 0 ? (
            <ul className="border-2 lista-busca">
              {results.map((result) => (
                <li
                  key={result._id}
                  onClick={() => handleSelectItem(result)}
                  style={{ cursor: "pointer" }}
                >
                  {result.description} ({result.brand})
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
      {selectedProduto ? (
        <div className="d-flex flex-column">
          <label>Produto: </label>
          <input
            className="form-control"
            type="text"
            value={selectedProduto.description}
            readOnly
            style={{ border: "none", background: "transparent", width: "auto" }}
            hidden
          />
          <div className="d-flex align-items-center btn btn-primary">
            <span className="mx-3">
              {selectedProduto.description} ({selectedProduto.brand})
            </span>
            <div
              className="btn btn-warning"
              style={{ width: "auto" }}
              onClick={openModal}
            >
              <i className="bi bi-pencil-square"></i>
            </div>
            <div
              className="btn btn-danger mx-2"
              style={{ width: "auto" }}
              onClick={cleanProduto}
            >
              <i className="bi bi-x-circle"></i>
            </div>
          </div>
          {/* Modal de edit produto */}
          <ModalEditProduto
            show={showModal}
            onClose={closeModal}
            error={error}
            setError={setError}
            userData={userData}
            selectedProduto={selectedProduto}
            setSelectedProduto={setSelectedProduto}
            updateProductName={updateProductName}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SearchProduto;
