// components/Inventory.js
import React, { useState } from 'react';

export default function Inventory() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', quantity: 10 },
    { id: 2, name: 'Product 2', quantity: 15 },
    // เพิ่มสินค้าเพิ่มเติมตามต้องการ
  ]);

  return (
    <div>
      <h2>Inventory Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
