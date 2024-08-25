import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const CustomerManagement = () => {

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



  // State สำหรับจัดเก็บข้อมูลลูกค้า
  const [customers, setCustomers] = useState([]);
  // State สำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState('');
  // State สำหรับจัดการข้อมูลลูกค้าที่กำลังแก้ไข
  const [editingCustomer, setEditingCustomer] = useState(null);
  // State สำหรับการแสดงหรือซ่อนฟอร์มเพิ่มลูกค้า
  const [showAddForm, setShowAddForm] = useState(true);

  // Fetch ข้อมูลลูกค้าเมื่อ component ถูกโหลด
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/fetchAllcustomer`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
    fetchData();
  }, []);

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงค่าในช่องค้นหา
  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  // กรองข้อมูลลูกค้าตามคำค้นหา
  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันสำหรับการแก้ไขข้อมูลลูกค้า
  const handleEditCustomer = customer => {
    setEditingCustomer(customer);
    setShowAddForm(true);
  };

  // ฟังก์ชันสำหรับการลบข้อมูลลูกค้า
  const handleDeleteCustomer = async customerId => {
    try {
      await axios.delete(`${VITE_API_URL}/deleteCustomer/${customerId}`);
      alert('Customer deleted successfully!');
      setCustomers(customers.filter(customer => customer.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer. Please try again.');
    }
  };

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงการแสดงหรือซ่อนฟอร์ม
  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setEditingCustomer(null); // รีเซ็ตข้อมูลลูกค้าที่กำลังแก้ไขเมื่อซ่อนฟอร์ม
  };
  return (
    <div className="">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">ระบบจัดการบัญชีลูกค้า</h1>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="ค้นหาชื่อ..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="border border-gray-300 rounded p-2 "
          />
        </div>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
              <th className="border p-2 w-700px">รหัส</th>
              <th className="border p-2">ชื่อ-สกุล</th>
              <th className="border p-2">เพศ</th>
              <th className="border p-2">วันที่เข้าบริการครั้งแรก</th>
              <th className="border p-2">เบอร์โทร</th>
              <th className="border p-2">อีเมลล์</th>
              <th className="border p-2">ที่อยู่</th>
              <th className="border p-2">รายละเอียด</th>
              <th className="border p-2">ผู้บันทึก</th>
              {/* <th className="border p-2">รหัสบัตรประชาชน</th> */}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-100">
                <td className="border p-2">{customer.id}</td>
                <td className="border p-2">{customer.full_name}</td>
                <td className="border p-2">{customer.sex}</td>
                <td className="border p-2">{customer.birth_date}</td>
                <td className="border p-2">{customer.tele_number}</td>
                <td className="border p-2">{customer.e_mail}</td>
                <td className="border p-2">{customer.address}</td>
                <td className="border p-2">{customer.detail}</td>
                <td className="border p-2">{customer.update_record}</td>
                {/* <td className="border p-2">{customer.national_id}</td> */}
                <td className="border p-2">
                  <div className="flex items-center justify-start space-x-2">
                    <button onClick={() => handleEditCustomer(customer)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 w-24 rounded mr-2" >แก้ไข</button>
                    <button onClick={() => handleDeleteCustomer(customer.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4 mt-10">
        <button onClick={handleToggleAddForm} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
          {showAddForm ? 'ซ่อนแบบฟอร์มเพิ่ม' : 'เพิ่ม บัญชีลูกค้า'}
        </button>
      </div>
      {showAddForm && <AddCustomerForm customer={editingCustomer} setShowAddForm={setShowAddForm} setCustomers={setCustomers} customers={customers} />}
    </div>
  );
};
// ฟอร์มเพิ่มหรือแก้ไขลูกค้า
const AddCustomerForm = ({ customer, setShowAddForm, setCustomers, customers }) => {
  // State สำหรับจัดเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    id: '',
    nameprefix: '',
    full_name: '',
    sex: '',
    birth_date: '',
    tele_number: '',
    E_mail: '',
    address: '',
    detail: '',
    update_record: '',
    national_id: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id,
        nameprefix: customer.nameprefix,
        full_name: customer.full_name,
        sex: customer.sex,
        birth_date: customer.birth_date,
        tele_number: customer.tele_number,
        E_mail: customer.e_mail,
        address: customer.address,
        detail: customer.detail,
        update_record: customer.update_record,
        national_id: customer.national_id
      });
    }
  }, [customer]);
  // ฟังก์ชันที่จะถูกเรียกเมื่อมีการเปลี่ยนแปลงค่าในฟอร์ม
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // ฟังก์ชันที่จะถูกเรียกเมื่อมีการส่งฟอร์ม
  const handleSubmit = async e => {

    const data_id = JSON.parse(localStorage.getItem('data_id'));
    formData.update_record = data_id.full_name
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`${VITE_API_URL}/updateCustomer/${formData.id}`, formData);
        const updatedCustomers = customers.map(customer => customer.id === formData.id ? { ...customer, ...formData } : customer);
        setCustomers(updatedCustomers);
      } else {
        const response = await axios.post(`${VITE_API_URL}/Addcustomerdata`, formData);
        setCustomers([...customers, { ...formData, id: response.data.id }]);
      }
      alert(`Customer ${formData.id ? 'updated' : 'added'} successfully!`);
      setShowAddForm(false);
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'adding'} customer:`, error);
      alert(`Failed to ${formData.id ? 'update' : 'add'} customer. Please try again.`);
    }
  };

  return (

    <div className="container mx-auto">
      <div className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
        <h2 className="text-3xl font-semibold mb-5">{customer ? 'แก้ไข บัญชีลูกค้า' : 'สร้างบัญชีลูกค้า'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label htmlFor="nameprefix" className="text-sm font-medium text-gray-400 mb-1">นาย/นางสาว</label>
              <input type="text" name="nameprefix" placeholder="นาย/นางสาว" value={formData.nameprefix} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="full_name" className="text-sm font-medium text-gray-400 mb-1">ชื่อ-สกุล</label>
              <input type="text" name="full_name" placeholder="ชื่อ-สกุล" value={formData.full_name} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="sex" className="text-sm font-medium text-gray-400 mb-1">เพศ</label>
              <input type="text" name="sex" placeholder="เพศ" value={formData.sex} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="birth_date" className="text-sm font-medium text-gray-400 mb-1">วันที่สมัครสมาชิก</label>
              <input type="date" name="birth_date" placeholder="วันที่สมัครสมาชิก" value={formData.birth_date} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="tele_number" className="text-sm font-medium text-gray-400 mb-1">เบอร์โทร</label>
              <input type="tel" name="tele_number" placeholder="เบอร์โทร" value={formData.tele_number} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="E_mail" className="text-sm font-medium text-gray-400 mb-1">อีเมลล์</label>
              <input type="email" name="E_mail" placeholder="อีเมลล์" value={formData.E_mail} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="address" className="text-sm font-medium text-gray-400 mb-1">ที่อยู่</label>
              <input type="text" name="address" placeholder="ที่อยู่" value={formData.address} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="national_id" className="text-sm font-medium text-gray-400 mb-1">หมายเลขบัตรประชาชน</label>
              <input type="text" name="national_id" placeholder="หมายเลขบัตรประชาชน" value={formData.national_id} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="detail" className="text-sm font-medium text-gray-400 mb-1">รายละเอียด</label>
              <textarea name="detail" placeholder="รายละเอียด" value={formData.detail} onChange={handleChange} className="textarea textarea-bordered w-full"></textarea>
            </div>
            {/* <div className="flex flex-col">
              <label htmlFor="update_record" className="text-sm font-medium text-gray-400 mb-1">ผู้บันทึก</label>
              <input type="text" name="update_record" placeholder="ผู้บันทึก" value={formData.update_record} onChange={handleChange} className="input input-bordered w-full" />
            </div> */}
          </div>
          <div className="mb-4 flex justify-center">
            <button type="submit" className="btn btn-primary ">{customer ? 'อัพเดท บัญชีลูกค้า' : 'เพิ่มบัญชีลูกค้า'}</button>

          </div>
        </form>
      </div>
    </div>




  );
};

export default CustomerManagement;
