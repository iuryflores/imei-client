import React from "react";

function ItemFornecedor({ item }) {
  return (
    <tr key={item._id} className="align-middle">
      <th scope="row">
        {item.type === "juridica" ? (
          <i className="bi bi-building-fill"></i>
        ) : (
          <i className="bi bi-person-fill"></i>
        )}
      </th>
      <td className="text-left capitalize">{item.full_name.toLowerCase()}</td>
      <td>{item.document}</td>
      <td className="no-mobile">{item.contact}</td>
      <td>
        {new Date(item.createdAt.slice(0, -1)).toLocaleDateString("pt-br", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}

export default ItemFornecedor;
