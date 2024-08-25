import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

function Partorder() {
  const [searchTerms, setSearchTerms] = useState('');
  const [items, setItems] = useState({});
  const [filteredItems, setFilteredItems] = useState({});
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filterItems = () => {
      let filtered = items;
  
      if (category !== 'all') {
        filtered = { [category]: items[category]?.filter(item => item.name.toLowerCase().includes(searchTerms.toLowerCase())) || [] };
      } else {
        filtered = Object.keys(items).reduce((acc, cat) => {
          acc[cat] = items[cat].filter(item => item.name.toLowerCase().includes(searchTerms.toLowerCase()));
          return acc;
        }, {});
      }
  
      setFilteredItems(filtered);
    };

    filterItems();
  }, [searchTerms, category, items]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAllpart`);
      const categorizedItems = categorizeItems(response.data);
      setItems(categorizedItems);
      setFilteredItems(categorizedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const categorizeItems = (items) => {
    return items.reduce((acc, item) => {
      const { type } = item;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
  };

  const handleSearchCart = (e) => {
    e.preventDefault();
    let filtered = category !== 'all' ? {[category]: items[category].filter(item => item.name.toLowerCase().includes(searchTerms.toLowerCase()))} : Object.keys(items).reduce((acc, cat) => {
      acc[cat] = items[cat].filter(item => item.name.toLowerCase().includes(searchTerms.toLowerCase()));
      return acc;
    }, {});
    setFilteredItems(filtered);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const addToCart = (item, quantity) => {
    const newItem = { ...item, quantity: Number(quantity) };
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
    if (existingItemIndex >= 0) {
      // Update the quantity of the existing item
      const updatedCart = cart.map((cartItem, index) => {
        if (index === existingItemIndex) {
          return { ...cartItem, quantity: cartItem.quantity + Number(quantity) };
        }
        return cartItem;
      });
      setCart(updatedCart);
    } else {
      // Add the new item to the cart
      setCart([...cart, newItem]);
    }
  };
  
  

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
<>
<div className="flex min-h-screen">
    <div className="sidebar bg-gray-00 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out"> 
    <div className="sticky top-0 bg-gray-900  space-y-9 py-7 px-2 h-screen overflow-auto">
      <h2 className="text-xl font-bold mb-2">หมวดหมู่</h2>
      <ul className="space-y-2">
        <li>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => setCategory('all')}
          >
            All Categories
          </button>
        </li>
        {Object.keys(items).map((cat) => (
          <li key={cat}>
            <button
              className="text-white hover:text-gray-200"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
    </ div>
    <div className="container mx-auto my-8 max-w-4xl max-h-160">
      <h1 className="text-3xl font-bold mb-4">คลังเก็บของ</h1>
      <form onSubmit={handleSearchCart} className="mb-4">
        <div className="form-control">
          <div className="input-group">
            <select className="select select-bordered w-full max-w-xs" value={category} onChange={handleCategoryChange}>
              <option value="all">หมวดหมู่ ทั้งหมด</option>
              {Object.keys(items).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              placeholder="Enter product name"
              className="input input-bordered"
            />
            <button type="submit" className="btn btn-primary">ค้นหา</button>
          </div>
        </div>
      </form>
      <div>
      {Object.keys(filteredItems).map(cat => (
    // ตรวจสอบก่อนว่ามีสินค้าในหมวดหมู่นี้หรือไม่
    filteredItems[cat].length > 0 && (
      <div key={cat} className="mb-4">
        <h2 className="text-2xl font-bold flex-grow text-blue-500">{cat}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems[cat].map(item => (
            <div key={item.id} className="card bg-base-100 shadow-xl w-30 h-auto">
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p>Price: ${item.price}</p>
                <div className="card-actions justify-end">
                  <input type="number" min="1" defaultValue="1" className="input input-bordered input-sm w-20" id={`quantity-${item.id}`} />
                  <button onClick={() => addToCart(item, document.getElementById(`quantity-${item.id}`).value)} className="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  ))}
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {cart.map(item => (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                <button className="btn btn-error btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                </td>
            </tr>
            ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-bold mt-4">Total: ${calculateTotal().toFixed(2)}</h3>
      </div>
    </div>
    </div>
    </>
  );
}

export default Partorder;
