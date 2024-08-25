import React, { useState } from 'react';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

function CarSelector() {
  const [carquery, setcarQuery] = useState('');
  const [carresults, setcarResults] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const fetchCarData = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/fetchAllcar`);
      const data = await response.json();
      const filteredData = data.filter(car => 
        car.registration_id === carquery);
      setcarResults(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    fetchCustomerData(car.owner_id);
  };
  
///เพิ่มฟังก์ชันสำหรับดึงข้อมูลลูกค้า///
  const fetchCustomerData = async (ownerId) => {
    setLoadingCustomer(true);
    try {
      const response = await fetch(`${VITE_API_URL}/fetchAllcustomerById/${ownerId}`);
      const data = await response.json();
      setCustomerInfo(data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoadingCustomer(false);
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search car by registration ID..."
          value={carquery}
          onChange={(e) => setcarQuery(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={fetchCarData} className="btn btn-primary">Search</button>
      </div>
      <ul className="list-disc pl-5">
        {carresults.map(car => (
          <li key={car.id} className="flex justify-between items-center my-2">
            {car.brand} {car.model} - {car.registration_id}
            <button onClick={() => handleSelectCar(car)} className="btn btn-secondary btn-xs">Select</button>
          </li>
        ))}
      </ul>
      {selectedCar && (
        <div className="card w-96 bg-base-100 shadow-xl p-4">
          <h2 className="card-title">Selected Car Details</h2>
          <p>Registration ID: {selectedCar.registration_id || 'N/A'}</p>
          <p>Owner ID: {selectedCar.owner_id || 'N/A'}</p>
          <p>Brand: {selectedCar.brand || 'N/A'}</p>
          <p>Model: {selectedCar.model || 'N/A'}</p>
          <p>Year: {selectedCar.year || 'N/A'}</p>
          <p>Color: {selectedCar.color || 'N/A'}</p>
        </div>
      )}
      {customerInfo && (
        <div className="card w-96 bg-base-100 shadow-xl p-4 mt-4">
          <h2 className="card-title">Customer Details</h2>
          <p>Name: {customerInfo.full_name || 'N/A'}</p>
          <p>Email: {customerInfo.E_mail || 'N/A'}</p>
          <p>Phone: {customerInfo.tele_number || 'N/A'}</p>
          <p>Address: {customerInfo.address || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default CarSelector;