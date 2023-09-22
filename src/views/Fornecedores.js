import React, { useEffect, useState } from "react";
import api from "../utils/api.utils";
import { FornecedoresAdd } from "../components/FornecedoresAdd";
import ItemFornecedor from "../components/ItemFornecedor";
import PagControls from "../components/PagControls";
import FilterAlphabet from "../components/FilterAlphabet";

export const Fornecedores = ({
  message,
  setMessage,
  error,
  setError,
  loading,
  setLoading,
  userId,
  openModal,
  showModal,
  closeModal,
}) => {

  const [allFornecedores, setAllFornecedores] = useState([]);

  const updateFornecedorList = (newFornecedor) => {
    setAllFornecedores([...allFornecedores, newFornecedor]);
  };

  useEffect(() => {
    const getFornecedores = async () => {
      try {
        const data = await api.getAllFornecedores();
        setAllFornecedores(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getFornecedores();
  }, [loading, setLoading]);

  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sorted = [...allFornecedores].sort((a, b) =>
      a.full_name.localeCompare(b.full_name)
    );
    setSortedData(sorted);
  }, [allFornecedores]);

  const itemsPerPage = 10;
  const [selectedAlphabet, setSelectedAlphabet] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAlphabetFilter = (alphabet) => {
    setSelectedAlphabet(alphabet);
    setCurrentPage(1);
  };

  const filteredData = selectedAlphabet
    ? sortedData.filter((item) => item.full_name.startsWith(selectedAlphabet))
    : sortedData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderData = currentData.map((item) => (
    <ItemFornecedor key={item._id} item={item} />
  ));

  const renderPagControle = (
    <PagControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );

  const alphabetList = [
    ...Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    ),
  ];

    // Função de clique para o caractere "#"
    const handleClickHash = () => {
      setSelectedAlphabet(""); // Limpa qualquer filtro alfabético
      setCurrentPage(1);
    };

  const renderAlphabetFilter = (
    <FilterAlphabet
      alphabetList={alphabetList}
      selectedAlphabet={selectedAlphabet}
      onAlphabetChange={handleAlphabetFilter}
      handleClickHash={handleClickHash}
    />
  );



  return (
    <div className="p-3 m-3 text-light d-flex flex-column align-items-center">
      <h1>Lista de Fornecedores ({allFornecedores.length})</h1>
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="mb-3">
        <div
          className="d-flex align-items-center btn btn-outline-info"
          onClick={openModal}
        >
          <span>Adicionar</span>
          <i className="bi bi-plus-circle-fill mx-1 fs-6"></i>
        </div>
      </div>

      <div className="border p-2 bg-light shadow rounded w-100">
        {renderAlphabetFilter}
        <table className="table mb-0 table-striped table-hover">
          <thead>
            <tr>
              <th className="text-center">PF/PJ</th>
              <th>Nome Completo/Razão Social</th>
              <th>CPF/CNPJ</th>
              <th>Contato</th>
              <th>Desde</th>
            </tr>
          </thead>
          <tbody>{renderData}</tbody>
        </table>
      </div>
      {renderData.length > 1 ? (
        renderPagControle
      ) : (
        <>
          Acabou a lista com inicial <strong>{selectedAlphabet}</strong>
        </>
      )}
      {/* Modal de cadastro de cliente */}
      <FornecedoresAdd
        show={showModal}
        onClose={closeModal}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        userId={userId}
        updateFornecedorList={updateFornecedorList}
      />
    </div>
  );
};
