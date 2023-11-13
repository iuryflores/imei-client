import React, { useState, useEffect } from "react";
import api from "../utils/api.utils";

const SearchProdutoVenda = ({
  setError,
  onSellingPriceChange,
  selectedProducts,
  setSelectedProducts,
  formatarValor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState("");

  const updateQuantity = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    newQuantity = parseInt(newQuantity);
    console.log(updatedProducts, newQuantity);
    if (newQuantity > 0 && newQuantity <= updatedProducts[index].qtd) {
      setError(null);
      updatedProducts[index].quantity = newQuantity;
      setSelectedProducts(updatedProducts);
      if (onSellingPriceChange) {
        onSellingPriceChange(updatedProducts);
      }
    } else {
      setError("Você excedeu a quantidade disponível em estoque.");
    }
  };

  const updateSellingPrice = (index, newSellingPrice) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].sellingPrice = newSellingPrice;
    setSelectedProducts(updatedProducts);

    if (onSellingPriceChange) {
      onSellingPriceChange(updatedProducts, quantity);
    }
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
      <label>Buscar produtos sem IMEI/Serial:</label>
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
            <b>Produtos adicionados:</b>
          </span>
          <table className="table table-striped table-outros">
            <thead>
              <tr>
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "45%" }}>Descrição</th>
                <th className="text-center" style={{ width: "10%" }}>
                  Quantidade
                </th>
                <th className="text-center" style={{ width: "20%" }}>
                  Preço
                </th>
                <th className="text-center" style={{ width: "20%" }}>
                  Preço de venda
                </th>
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
                  <td className="text-center">
                    <input
                      className="form-control text-center"
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                    />
                  </td>
                  <td className="text-center">
                    R$ {formatarValor(product.valorVendaDb)}
                  </td>
                  <td className="text-center">
                    <div class="input-group">
                      <span class="input-group-text">R$</span>
                      <input
                        className="form-control"
                        type="text"
                        value={product.sellingPrice}
                        onChange={(e) =>
                          updateSellingPrice(index, e.target.value)
                        }
                      />{" "}
                      <span class="input-group-text">,00</span>
                    </div>
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
