
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

export default function Book2() {
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
      if (!all_role.some(permission => permission["job"] === true)) {
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


  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');


  //     ///////////////customer///////////
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);



  const [carquery, setcarQuery] = useState('');
  const [carresults, setcarResults] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const [jobData, setJobData] = useState({
    responsible_Employee_id: '',
    car_id: '',
    car_in: '',
    job_status: '',
    repair_details: '',
    customer_feedback: "",
    update_record: '',
  });

  const fetchCarData = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/fetchAllcar`);
      const data = await response.json();
      // const filteredData = data.filter(car => car.registration_id == carquery);

      const filteredData = data.filter(car => car.registration_id.toLowerCase().includes(carquery.toLowerCase()));

      setcarResults(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    fetchCustomerData(car.owner_id);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
  };

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

  const handleEmployeeChange = (event) => {
    const selectedId = event.target.value;
    const selectedName = event.target[event.target.selectedIndex].text;
    setSelectedEmployeeId(selectedId);
    setSelectedEmployeeName(selectedName);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSaveData = async () => {

    const data_id = JSON.parse(localStorage.getItem('data_id'));

    jobData.update_record = data_id.full_name
    jobData.responsible_Employee_id = selectedEmployeeId;
    jobData.car_id = selectedCar.registration_id;
    jobData.job_status = "รอดำเนินการ"


    try {
      const responseJob = await axios.post(`${VITE_API_URL}/Addjobdata`, jobData);
      alert('Job data saved successfully JOB ID = ', responseJob.data.id);

    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  const fetchData = () => {
    axios.get(`${VITE_API_URL}/fetchAllWorkforceInformation`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div className="app-container max-w-[1250px] mx-auto">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
  <h1 className="text-4xl font-bold text-center mb-6">ลงทะเบียนซ่อมรถยนต์</h1>
  <div className="">
    <h3>ระบุป้ายทะเบียนรถยนต์</h3>
    <div className="flex items-center space-x-2 mb-2">
      <input type="text" placeholder="Search car by registration ID..." value={carquery} onChange={(e) => setcarQuery(e.target.value)} className="input input-bordered w-full max-w-xs" />
      <button onClick={fetchCarData} className="btn ">ค้นหา</button>
    </div>

    <ul className="list-disc pl-5">
      {carresults.map(car => (
        <li key={car.id} className="flex justify-between items-center my-2">
          {car.brand} {car.model} - {car.registration_id}
          <button onClick={() => handleSelectCar(car)} className="btn btn-secondary btn-xs">เลือก</button>
        </li>
      ))}
    </ul>

    {selectedCar && (
      <div className="card compact side bg-base-100 shadow-xl mb-4 p-5">
        <h2 className="card-title text-2xl mb-4 text-center">รายละเอียดรถ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div><span className="font-bold">ป้ายทะเบียน:</span> <span className="ml-2">{selectedCar.registration_id || 'N/A'}</span></div>
          <div><span className="font-bold">รหัสเจ้าของรถ:</span> <span className="ml-2">{selectedCar.owner_id || 'N/A'}</span></div>
          <div><span className="font-bold">ยี่ห้อ:</span> <span className="ml-2">{selectedCar.brand || 'N/A'}</span></div>
          <div><span className="font-bold">รุ่น:</span> <span className="ml-2">{selectedCar.model || 'N/A'}</span></div>
          <div><span className="font-bold">ปี:</span> <span className="ml-2">{selectedCar.year || 'N/A'}</span></div>
          <div><span className="font-bold">สี:</span> <span className="ml-2">{selectedCar.color || 'N/A'}</span></div>
        </div>
      </div>
    )}
  </div>
  
  <div className="p-4">
    <h3>เลือกลูกค้า</h3>
    <ul className="list-disc pl-5">
      {results.map(customer => (
        <li key={customer.id} className="flex justify-between items-center my-2">
          {customer.full_name}
          <button onClick={() => handleSelectCustomer(customer)} className="btn btn-secondary btn-xs">เลือก</button>
        </li>
      ))}
    </ul>

    {customerInfo && (
      <div className="card compact side bg-base-100 shadow-xl mb-4 p-5">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">ข้อมูลของลูกค้า</h2>
          <div className="flex flex-wrap justify-between text-base">
            <div className="flex-1 min-w-[50%]"><span className="font-bold">ชื่อ:</span> {customerInfo.full_name || 'N/A'}</div>
            <div className="flex-1 min-w-[50%]"><span className="font-bold">อีเมลล์:</span> {customerInfo.e_mail || 'N/A'}</div>
            <div className="flex-1 min-w-[50%]"><span className="font-bold">เบอร์โทร:</span> {customerInfo.tele_number || 'N/A'}</div>
            <div className="flex-1 min-w-[50%]"><span className="font-bold">ที่อยู่:</span> {customerInfo.address || 'N/A'}</div>
          </div>
        </div>
      </div>
    )}
    
    {selectedCustomer && (
      <div className="card bg-base-100 shadow-xl p-4">
        <h2 className="card-title">รายละเอียด ลูกค้า</h2>
        <p>ชื่อ-สกุล: {selectedCustomer.full_name || 'N/A'}</p>
        <p>อีเมลล์: {selectedCustomer.e_mail || 'N/A'}</p>
        <p>เบอร์โทร: {selectedCustomer.tele_number || 'N/A'}</p>
        <p>ที่อยู่: {selectedCustomer.address || 'N/A'}</p>
        <p>รายละเอียด: {selectedCustomer.detail || 'N/A'}</p>
      </div>
    )}
  </div>
  
  <div className="p-4">
    <h3>ระบุวันที่รถเข้าซ่อม</h3>
    <input type="date" name="car_in" value={jobData.car_in} onChange={handleChange} required className="input input-bordered w-full" />
    
    <h3>ระบุหมายเหตุและรายละเอียดงานซ่อม</h3>
    <input type="text" name="repair_details" value={jobData.repair_details} onChange={handleChange} placeholder="Repair Details" className="input input-bordered w-full max-w-xs" required />
    
    <h3>ระบุหมายเหตุของลูกค้า</h3>
    <input type="text" name="customer_feedback" value={jobData.customer_feedback} onChange={handleChange} placeholder="Customer Feedback" className="input input-bordered w-full max-w-xs" />
  </div>
  
  <div className="p-4">
    <h1 className="text-xl font-bold">เลือกรายชื่อพนักงาน</h1>
    <select className="select select-bordered w-full max-w-xs" value={selectedEmployeeId} onChange={handleEmployeeChange} >
      <option value="">โปรดเลือก</option>
      {employees.map(employee => (
        <option key={employee.id} value={employee.id}>
          {employee.full_name}
        </option>
      ))}
    </select>
    {selectedEmployeeId && (
      <div className="mt-4">
        <h2 className="text-lg font-semibold">ข้อมูลพนักงานที่เลือก:</h2>
        <p>ID: {selectedEmployeeId}</p>
        <p>ชื่อ: {selectedEmployeeName}</p>
      </div>
    )}
  </div>
  
  <div className="flex justify-center space-x-2 p-4">
    <button onClick={handleSaveData} className="btn btn-active btn-primary px-5 py-2">  บันทึก </button>
  </div>
</div>

    </div>
  );
}
