import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";

const SearchFornecedor = ({
  title,
  selectedItem,
  setSelectedItem,
  setError,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await api.buscaFornecedor(searchTerm);
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
  }, [searchTerm, title]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedItem(null); // Limpa o item selecionado quando o usuário digita
    setError(null);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setShowFornecedor(false);
    setSearchTerm(""); // Limpa o termo de pesquisa quando um item é selecionado
  };

  const [showFornecedor, setShowFornecedor] = useState(true);

  const cleanFornecedor = () => {
    setShowFornecedor(true);
    setSelectedItem(null);
  };

  return (
    <div>
      {showFornecedor ? (
        <>
          <label>Pesquisar {title}</label>
          <input
            type="text"
            className="form-control"
            placeholder={`Digite o ${title.toLowerCase()}`}
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
                  {result.type === "juridica" ? (
                    <i className="bi bi-building-fill mx-2"></i>
                  ) : (
                    <i className="bi bi-person-fill mx-2"></i>
                  )}
                  {result.full_name} ({result.document})
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
      {selectedItem ? (
        <div className="d-flex align-items-center">
          <label>Fornecedor: </label>
          <input
            className="form-control"
            type="text"
            value={selectedItem.full_name}
            readOnly
            style={{ border: "none", background: "transparent", width: "auto" }}
            hidden
          />
          <span className="mx-3">
            {selectedItem.full_name} ({selectedItem.document})
          </span>
          <div
            className="btn btn-info"
            style={{ width: "auto" }}
            onClick={cleanFornecedor}
          >
            <i className="bi bi-pencil-square"></i>
          </div>
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-danger text-center">
          <b>{error}</b>
        </div>
      ) : null}
    </div>
  );
};

export default SearchFornecedor;
