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
    setError(null);
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
        <div className="d-flex flex-column">
          <label>Fornecedor: </label>
          <input
            className="form-control"
            type="text"
            value={selectedItem.full_name}
            readOnly
            style={{ border: "none", background: "transparent", width: "auto" }}
            hidden
          />
          <div className="d-flex align-items-center btn btn-primary">
            <span className="mx-3">
              {selectedItem.full_name} ({selectedItem.document})
            </span>
            <div
              className="btn btn-warning"
              style={{ width: "auto" }}
              onClick={cleanFornecedor}
            >
              <i className="bi bi-pencil-square"></i>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchFornecedor;
