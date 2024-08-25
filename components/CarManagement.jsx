import React, { useState, useEffect } from "react";
import axios from "axios";
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const CarManagement = () => {
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
      if (!all_role.some(permission => permission["carandcustomer"] === true)) {
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

  const [cars, setCars] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  // State สำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState('');
  const fetchCars = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAllcar`);

      setCars(response.data);
      setCars(currentData => currentData.sort((a, b) => a.owner_id - b.owner_id));
    } catch (error) {
      console.error('Error fetching cars data:', error);
    }
  };
  useEffect(() => {


    fetchCars();
  }, []);

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงค่าในช่องค้นหา
  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  // กรองข้อมูลลูกค้าตามคำค้นหา
  const filteredCustomers = cars.filter(car =>
    car.registration_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    registration_id: "",
    owner_id: "",
    Policy_number: "",
    insurance_company: "",
    insurance_expiry_date: "",
    car_type: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    engine_number: "",
    chassis_number: "",
    Gear_type: "",
    detail: "",
    update_record: "",
  });

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงค่าในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม

  const handleSubmit = async (e) => {

    const data_id = JSON.parse(localStorage.getItem('data_id'));
    formData.update_record = data_id.full_name
    e.preventDefault();
    const submitData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value])
    );

    const url = isEditing ? `${VITE_API_URL}/Updatecardata/${editId}` : `${VITE_API_URL}/Addcardata`;
    const method = isEditing ? 'put' : 'post';

    try {
      const response = await axios[method](url, submitData);
      console.log("Response:", response.data);
      alert(isEditing ? "Car updated successfully!" : "Car added successfully!");
      setIsEditing(false); // ออกจากโหมดการแก้ไข
      setEditId(null); // รีเซ็ต ID การแก้ไข
      fetchCars();
    } catch (error) {
      console.error("Failed to submit car data:", error.response.data);
      alert("Failed to submit car data.");
    }
  };

  const startEdit = (car) => {
    setIsEditing(true);
    setEditId(car.registration_id);
    setFormData({ ...car });
  };

  const deleteCar = async (registration_id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`${VITE_API_URL}/deletecar/${registration_id}`);
        alert("Car deleted successfully!");
        setCars(cars.filter(car => car.registration_id !== registration_id));
      } catch (error) {
        console.error("Failed to delete car:", error.response.data);
        alert("Failed to delete car.");
      }
    }
  };
  return (
    <div className="">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">ระบบจัดการข้อมูลรถยนต์</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="ค้นหาทะเบียนรถ"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
              <th className="border p-2">เลขทะเบียน</th>
              <th className="border p-2">รหัสเจ้าของ</th>
              <th className="border p-2">ยี่ห้อ</th>
              <th className="border p-2">รุ่น</th>
              <th className="border p-2">ปี</th>
              <th className="border p-2">สี</th>
              <th className="border p-2">รายละเอียด</th>
              <th className="border p-2">Actions</th>

            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(car => (
              <tr key={car.registration_id} className="hover:bg-gray-100">
                <td className="border p-2">{car.registration_id}</td>
                <td className="border p-2">{car.owner_id}</td>
                <td className="border p-2">{car.brand}</td>
                <td className="border p-2">{car.model}</td>
                <td className="border p-2">{car.year}</td>
                <td className="border p-2">{car.color}</td>
                <td className="border p-2">{car.detail}</td>
                <td className="border p-2">
                  <div className="flex items-center justify-start space-x-2">
                    <button onClick={() => startEdit(car)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">แก้ไข</button>
                    <button onClick={() => deleteCar(car.registration_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container mx-auto">
        <div className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
          <h2 className="text-3xl font-semibold mb-5">{isEditing ? "แก้ไข ข้อมูลรถยนต์" : "ลงทะเบียนรถยนต์"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Registration ID */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">ป้ายทะเบียน</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="registration_id"
                  value={formData.registration_id}
                  onChange={handleChange}
                  placeholder="ป้ายทะเบียน"
                  required
                /></div>
              {/* Owner ID */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">รหัสเจ้าของรถ</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  placeholder="รหัสเจ้าของรถ"
                  required
                /></div>

              {/* Car Type */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">ประเภทรถยนต์</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="car_type"
                  value={formData.car_type}
                  onChange={handleChange}
                  placeholder="ประเภทรถยนต์"
                  required
                /></div>
              {/* Brand */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">ยี่ห้อ</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="ยี่ห้อ"
                  required
                /></div>
              {/* Model */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">รุ่น</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="รุ่น"
                /></div>
              {/* Year */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">ปี</label>
                <input className="input input-bordered w-full"
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="ปี"
                /></div>

              {/* Color */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">สี</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="สี"
                /></div>
              {/* Gear Type */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">เกียร์</label>
                <select name="Gear_type" value={formData.Gear_type} onChange={handleChange} className="input input-bordered w-full">
                  <option value="">เกียร์</option>
                  <option value="auto">เกียร์อัตโนมัติ</option>
                  <option value="nomal_gear">เกียร์ธรรมดา</option>
                  <option value="CVT">เกียร์ CVT</option>
                  <option value="DCTs">เกียร์กึ่งอัตโนมัติ และเกียร์คลัตช์คู่ DCT</option>
                  {/* placeholder="Gear Type" */}
                </select>
              </div>
              {/* Detail */}
              <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea className="textarea textarea-bordered w-full"
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="รายละเอียดเพิ่มเติม"
                /></div>
              {/* Update Record */}
              {/* <div className="flex flex-col">
                <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">ผู้บันทึก</label>
                <input className="input input-bordered w-full"
                  type="text"
                  name="update_record"
                  value={formData.update_record}
                  onChange={handleChange}
                  placeholder="ผู้บันทึก"
                /></div> */}

            </div>
            <div className="flex items-center justify-center space-x-2"> 
            <button type="submit" className="btn btn-primary mt-4">บันทึก</button>
            </div>
          </form>
        </div></div>
    </div>
  );
};

export default CarManagement;
