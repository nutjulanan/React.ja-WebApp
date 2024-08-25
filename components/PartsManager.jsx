import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const PartsManager = () => {


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
  let navigate = useNavigate();
  const fetchPermission = async () => {
    try {
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      const response๘work_roles_permissions = await axios.get(`${VITE_API_URL}/work_roles_permissions/${data_id.id}`);
      const additionalInfos = response๘work_roles_permissions.data;
      const all_role = []
      for (const additionalInfo of additionalInfos) {
        if (additionalInfo.role_id !== undefined) {
          const responseroles = await axios.get(`${VITE_API_URL}/fetchroles_permissionsById/${additionalInfo.role_id}`);
          const additionalInforoles = responseroles.data;
          all_role.push({
            ...additionalInforoles,
          });
        } else {
          console.error('role_id is undefined for item:', item);
        }
      }
      if (!all_role.some(permission => permission["inventorystock"] === true)) {
        navigate('/garage');
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }
  useEffect(() => {
    fetchPermission()
  }, [])
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', type: '', description: '', update_record: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredParts, setFilteredParts] = useState([]);




  const fetchParts = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAllpart`);
      setParts(response.data);
    } catch (error) {
      console.error('Fetch parts error:', error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  useEffect(() => {
    let result = parts;

    if (searchTerm) {
      result = result.filter(part => part.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedType) {
      result = result.filter(part => part.type === selectedType);
    }

    result.sort((a, b) => b.quantity - a.quantity);

    setFilteredParts(result);
  }, [parts, searchTerm, selectedType]);

  // เพิ่มและแก้ไขข้อมูล
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data_id = JSON.parse(localStorage.getItem('data_id'));
    form.update_record = data_id.full_name
    try {
      if (editingId) {
        await axios.put(`${VITE_API_URL}/Updatepart/${editingId}`, form);
      } else {
        await axios.post(`${VITE_API_URL}/Addpartdata`, form);
      }
      setForm({ name: '', price: '', quantity: '', type: '', description: '', update_record: '' });
      setEditingId(null);
      fetchParts();
    } catch (error) {
      console.error('Submit form error:', error);
    }
  };

  const handleEdit = (part) => {
    setForm(part);
    setEditingId(part.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/deletepart/${id}`);
      fetchParts();
    } catch (error) {
      console.error('Delete part error:', error);
    }
  };

  const adjustQuantity = async (id, adjustment) => {
    const part = parts.find(part => part.id === id);
    if (!part) return;

    const newQuantity = part.quantity + adjustment;
    if (newQuantity < 0) return; // ป้องกันไม่ให้จำนวนเป็นลบ

    try {
      const updatedPart = await axios.put(`${VITE_API_URL}/Updatepart/${id}`, {
        ...part,
        quantity: newQuantity,
      });
      fetchParts(); // โหลดข้อมูลสินค้าใหม่หลังจากอัพเดท
    } catch (error) {
      console.error('Adjust quantity error:', error);
    }
  };


  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center ">คลังเก็บของ</h1>
      <div className="overflow-x-auto p-8">
      <div className="flex flex-wrap justify-center p-6">
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="mb-4">
      <input className="input input-bordered w-full" name="name" value={form.name} onChange={handleFormChange} placeholder="ชื่อ" />
    </div>
    <div className="mb-4">
      <input className="input input-bordered w-full" name="price" value={form.price} onChange={handleFormChange} placeholder="ราคา" />
    </div>
    <div className="mb-4">
      <input className="input input-bordered w-full" type="number" name="quantity" value={form.quantity} onChange={handleFormChange} placeholder="จำนวน" />
    </div>
    <div className="mb-4">
      <input className="input input-bordered w-full" name="type" value={form.type} onChange={handleFormChange} placeholder="หมวดหมู่" />
    </div>
    <div className="mb-4">
      <input className="input input-bordered w-full" name="description" value={form.description} onChange={handleFormChange} placeholder="รายละเอียด" />
    </div>
    <div className="text-center">
      <button type="submit" className={`btn ${editingId ? 'btn-success' : 'btn-primary'}`}>
        {editingId ? 'อัพเดท' : 'เพิ่ม'}
      </button>
    </div>
  </form>
</div>

        <div className=" flex-col items-center justify-center my-4">
          <input
            className="border border-gray-300 rounded p-3"
            type="text"
            placeholder="ค้นหาตามชื่อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-bordered  max-w-xs "
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">เลือกประเภท</option>
            <option value="กาว">กาว</option>
            <option value="สีโป้ว">สี</option>
            <option value="กระดาษ">กระดาษ</option>
          </select>
        </div>

        <h2 >รายการ </h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
              <th className="border p-2">ชื่อ</th>
              <th className="border p-2">ราคา</th>
              <th className="border p-2">จำนวน</th>
              <th className="border p-2 w-24">หมวดหมู่</th>
              <th className="border p-2">รายละเอียด</th>
              <th className="border p-2 w-24">ผู้บันทึก</th>
              <th className="border p-2">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map(part => (
              <tr className="hover:bg-gray-100" key={part.id}>
                <td className="border p-2">{part.name}</td>
                <td className="border p-2">{part.price}</td>
                <td className="border p-2">
                  <div className="flex items-center space-x-2">
                    <span>{part.quantity}</span>
                    <button className="join-item btn p-2 text-xl text-white bg-green-400 hover:bg-green-600" onClick={() => adjustQuantity(part.id, 1)}>+</button>
                    <button className="join-item btn p-2 text-xl text-white bg-red-400 hover:bg-red-600" onClick={() => adjustQuantity(part.id, -1)}>-</button>
                  </div>
                </td>

                <td className="border p-2">{part.type}</td>
                <td className="border p-2">{part.description}</td>
                <td className="border p-2">{part.update_record}</td>
                <td className="border p-2">
                  <button className="btn primary-content mr-2" onClick={() => handleEdit(part)}>แก้ไข</button>
                  <button className="btn btn-error text-lg px-4 py-2 mr-2" onClick={() => handleDelete(part.id)}> ลบ </button>

                  {/* <button className="btn btn-success mr-2" onClick={() => adjustQuantity(part.id, 1)}>+</button>
             <button className="btn btn-warning" onClick={() => adjustQuantity(part.id, -1)}>-</button>
         */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartsManager;
