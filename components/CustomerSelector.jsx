import React, { useState } from 'react';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
function CustomerSelector() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const fetchCustomerDatas = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/fetchAllcustomer`);
      const data = await response.json();
      const filteredData = data.filter(customer => 
        customer.full_name.toLowerCase().includes(query.toLowerCase()));
      setResults(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer); // อัพเดตข้อมูลลูกค้าที่เลือก
  };
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input type="text"placeholder="Search customer..."value={query} onChange={(e) => setQuery(e.target.value)} className="input input-bordered w-full max-w-xs"/>
        <button onClick={fetchCustomerDatas} className="btn btn-primary">Search</button></div>
      <ul className="list-disc pl-5">
        {results.map(customer => (
          <li key={customer.id} className="flex justify-between items-center my-2">
            {customer.full_name}
            <button onClick={() => handleSelectCustomer(customer)} className="btn btn-secondary btn-xs">Select</button>
          </li>
        ))}
      </ul>
      {selectedCustomer && (
        <div className="card w-96 bg-base-100 shadow-xl p-4">
          <h2 className="card-title">Details ลูกค้า</h2>
          <p>Full Name: {selectedCustomer.full_name || 'N/A'}</p>
          <p>Email: {selectedCustomer.e_mail || 'N/A'}</p>
          <p>Phone: {selectedCustomer.tele_number || 'N/A'}</p>
          <p>Address: {selectedCustomer.address || 'N/A'}</p>
          <p>Detail: {selectedCustomer.detail || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}
export default CustomerSelector;
