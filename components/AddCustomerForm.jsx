import React, { useState } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({
    nameprefix: '',
    full_name: '',
    sex: '',
    birth_date: '',
    tele_number: '',
    E_mail: '',
    address: '',
    detail: '',
    update_record: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_API_URL}/Addcustomerdata`, formData);
      alert('Customer added successfully!');
      // เพิ่มโค้ดอื่นๆ ตามความเหมาะสม เช่น รีเซ็ตฟอร์มหรือนำผู้ใช้ไปยังหน้าอื่น
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer. Please try again.');
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-3xl font-semibold mb-5">Add Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nameprefix" className="block text-sm font-medium text-gray-700">Name Prefix</label>
            <input type="text" name="nameprefix" placeholder="Name Prefix" onChange={handleChange} className="input input-bordered w-full" />
          </div>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
          <input type="text" name="sex" placeholder="Sex" onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date</label>
          <input type="date" name="birth_date" placeholder="Birth Date" onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="tele_number" className="block text-sm font-medium text-gray-700">Telephone Number</label>
          <input type="tel" name="tele_number" placeholder="Telephone Number" onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="E_mail" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="E_mail" placeholder="Email" onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" name="address" placeholder="Address" onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="detail" className="block text-sm font-medium text-gray-700">Detail</label>
          <textarea name="detail" placeholder="Detail" onChange={handleChange} className="input input-bordered w-full"></textarea>
        </div>
        <div>
          <label htmlFor="update_record" className="block text-sm font-medium text-gray-700">Update Record</label>
          <input type="text" name="update_record" placeholder="Update Record" onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
