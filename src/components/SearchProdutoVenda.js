import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";

const SearchProdutoVenda = ({ setError }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState("");

  const updateQuantity = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };

  const updateSellingPrice = (index, newSellingPrice) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].sellingPrice = newSellingPrice;
    setSelectedProducts(updatedProducts);
  };

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
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectItem = (item) => {
    setResults([]); // Clear search results
    addToSelectedProducts({ ...item, quantity, sellingPrice }); // Add to the array with initial values
    setQuantity(1); // Reset quantity to default
    setSellingPrice(""); // Clear selling price input
  };

  const addToSelectedProducts = (product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  return (
    <div className="border rounded bg-light p-2 w-100">
      <label>Buscar Acessório:</label>
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
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectItem(result)}
            >
              {result.description} ({result.brand})
            </li>
          ))}
        </ul>
      ) : null}
      {selectedProducts.length > 0 && (
        <div className="">
          <span>
            <b>Acessórios adicionados</b>
          </span>
          <table className="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Preço de custo</th>
                <th>Preço de venda</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    <div
                      className="btn btn-danger"
                      onClick={() => removeProduct(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </div>
                  </td>
                  <td>
                    {product.description} ({product.brand})
                  </td>
                  <td>
                    <input
                      className="form-control w-25"
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                    />
                  </td>
                  <td>{product.price}</td>
                  <td>
                    <input
                      className="form-control"
                      type="text"
                      value={product.sellingPrice}
                      onChange={(e) =>
                        updateSellingPrice(index, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchProdutoVenda;
