import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Reservation_search_customer() {
  const [Customer_Reservation_data, setCustomer_Reservation_data] = useState({
    data: "",
    reservations: [] // Add this line to store the reservations
  });


  const Reservation = async (data) => {
    try {
      const response = await axios.get(`${VITE_API_URL}/check_reservation/${data}`);
      console.log('Data fetched successfully:', response.data);
      setCustomer_Reservation_data(prevData => ({
        ...prevData,
        reservations: response.data.data // Update the reservations array in the state
      }));
    } catch (error) {
      alert('ไม่พบข้อมูลในระบบ', error.message);
      setCustomer_Reservation_data({
        data: "",
        reservations: []
      });
    }
  };


  const handleInputChange = (e) => {
    const { name, checked, type } = e.target;
    // Ensure value is always a string, never null
    const value = type === 'checkbox' ? checked : e.target.value || ""; // Fallback to empty string if value is falsy
    setCustomer_Reservation_data(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    Reservation(Customer_Reservation_data.data);
    // console.log(Customer_Reservation_data)
  };
  //ปุ่ม enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  return (
    <div id="main2Section">
      <div className="hero min-h-screen" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1459603677915-a62079ffd002?q=80&w=1534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay bg-opacity-90"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">ตรวจสอบ<br></br>การจองเข้าซ่อม</h1>
            <p className="mb-5">ป้อนอีเมลหรือเบอร์โทรศัพท์ที่ท่านได้จองไว้</p>
            <div className="search-form flex my-6 items-center">
              <input type="varchar" name="data" value={Customer_Reservation_data.data} onChange={handleInputChange} onKeyPress={handleKeyPress} placeholder="อีเมลหรือเบอร์โทรศัพท์ของท่าน" className="input input-bordered input-warning w-full max-w-xs" />
              <button onClick={handleSubmit} className="btn btn-success m-2">ยืนยัน</button>
            </div>
            {/* Display Reservations Here */}
            {Customer_Reservation_data.reservations.length > 0 && (
              <div className="reservations">
                {Customer_Reservation_data.reservations.map((reservation, index) => (
                  <div key={index} className="p-4 m-2 bg-white rounded shadow text-green-900">
                    <p><strong>Full Name:</strong> {reservation.fullname}</p>
                    <p><strong>Date:</strong> {reservation.date}</p>
                    <p><strong>Status:</strong> {reservation.status}</p>
                    <p><strong>Details:</strong> {reservation.response_details || "ยังไม่ได้ตรวจสอบ"}</p>
                    {/* Add more response_details as needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
