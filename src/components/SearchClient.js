import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";

const SearchClient = ({ title, selectedItem, setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await api.buscaCliente(searchTerm);
        setResults(data);
      } catch (error) {
        console.error(`Erro ao buscar ${title}:`, error);
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
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setShowCliente(false);
    setSearchTerm(""); // Limpa o termo de pesquisa quando um item é selecionado
  };

  const [showCliente, setShowCliente] = useState(true);

  const cleanCliente = () => {
    setShowCliente(true);
    setSelectedItem(null);
  };

  return (
    <div>
      {showCliente ? (
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
          <label>Cliente: </label>
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
              className="btn btn-info"
              style={{ width: "auto" }}
              onClick={cleanCliente}
            >
              <i className="bi bi-pencil-square"></i>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchClient;
