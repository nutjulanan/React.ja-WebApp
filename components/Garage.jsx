import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomerManagement from './CustomerManagement';
import CarManagement from './CarManagement';
import JobManagement from "./JobManagement";
import Employee from "./employee";
import Book from "./Book";
import Store from './Store';
import Book_repair from './Book_repair';
import Workday from './workday';
import Create_garages from './create_garages';
import Check_repairs from './Check_repairs';
import Bill_request from './Bill_request';
import Edit_web from './Edit_web';
import Book2 from './Book2';
import ServiceManagement from "./ServiceManagement";
import PartsManager from './PartsManager';
import JobTable from './JobsTable';
import Employee_permissions from './employee/Employee_permissions';
import Holidays from './Holidays';
import Reservation from './Reservation';

import Create_Quotation from './Create_Quotation';
import Create_car_receipt from './Create_car_receipt';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
import axios from 'axios';
export default function Garage({garageName},) {
  // const [displayComponent, setDisplayComponent] = useState("Book_repair");
  console.log(garageName);
  
  const scrollToTop = () => {  //สกอเมาอ์เลื่อนขึ้นไปด้านบน
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const hasPermission = (feature) => {
    // สมมติว่า permissions เป็น state ที่เก็บอาร์เรย์ของสิทธิ์ผู้ใช้
    return permissions?.some(permission => permission[feature] === true);
  };

  const [permissions, setPermissions] = useState(null);

  const fetchAPI = async () => {
    try {

      const data_id = JSON.parse(localStorage.getItem('data_id'));
      // console.log(data_id)
      if (data_id == null) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('data_id');
        navigate('/');
      }

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
          // ทำอย่างอื่นถ้า role_id ไม่ได้ถูกกำหนด
          console.error('role_id is undefined for item:', item);
        }
      }
      setPermissions(all_role);
      // console.log("curren1", all_role)


    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  let navigate = useNavigate();
  const handleLogout = () => {
    // ทำความสะอาดข้อมูลการล็อกอินที่นี่ (ถ้ามี)
    navigate('/');
  };

  const Logout = () => {
    // ทำความสะอาดข้อมูลการล็อกอินที่นี่ (ถ้ามี)
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('data_id');
    navigate('/');
  };

  return (
    <> 
      <div className="app-container max-w-[1250px] mx-auto">
        <div className="navbar bg-base-100 rounded-box">
          <div className="flex-1 px-2 lg:flex-none">
            <a className="btn btn-ghost text-xl" onClick={scrollToTop}>
            {/* <img src="src/assets/car-repair.png" alt="Car Repair Iconroyd"/> */}อู่นพดลการช่าง
            </a>
          </div>
          <div className="flex justify-end flex-1 px-2">
            <div className="flex items-stretch">
              <a className="btn btn-ghost rounded-btn" onClick={Logout} >ออกจากระบบ</a>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn w-24">เมนู</div>
                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li><Link to="/garage">หน้าหลัก</Link></li>
                  {hasPermission('job') && (<li><Link to="/garage/JobTable">จัดการรายการซ่อม</Link></li>)}
                  {hasPermission('job') && (<li><Link to="/garage/Book2">ลงทะเบียนซ่อมรถยนต์</Link></li>)}
                  {hasPermission('carandcustomer') && (<li><Link to="/garage/CustomerManagement">จัดการบัญชีลูกค้า</Link></li>)}
                  {hasPermission('carandcustomer') && (<li><Link to="/garage/CarManagement">จัดการข้อมูลรถยนต์</Link></li>)}
                  {hasPermission('quotations') && (<li><Link to="/garage/Create_Quotation">ใบเสนอราคา</Link></li>)}
                  {hasPermission('inventorystock') && (<li><Link to="/garage/ServiceManagement">จัดการ เซอร์วิสและบริการ</Link></li>)}
                  {hasPermission('inventorystock') && (<li><Link to="/garage/PartsManager">คลังเก็บของ</Link></li>)}
                  {hasPermission('vehiclereceipts') && (<li><Link to="/garage/Create_car_receipt">ใบรับรถ</Link></li>)}
                  {hasPermission('garages') && (<li><Link to="/garage/Workday">ทำงาน</Link></li>)}
                  {hasPermission('garages') && (<li><Link to="/garage/Holidays">สร้างวันหยุด</Link></li>)}
                  {hasPermission('garages') && (<li><Link to="/garage/Reservation">การจองเข้าซ่อม</Link></li>)}
                  {hasPermission('garages') && (<li><Link to="/garage/Employee">ระบบจัดการพนักงาน</Link></li>)}
                  {hasPermission('garages') && (<li><Link to="/garage/Create_garages">ตั้งค่าเว็บไซต์</Link></li>)}
                  <li><a onClick={Logout}>ออกจากระบบ</a></li>
                  {/* <li><a onClick={onLogout}>ออกจากระบบ</a></li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      <div className="main-container">
      </div>
      <Routes>
        <Route exact path="/" element={<Book />} />
        <Route path="/JobTable" element={<JobTable />} />
        <Route path="/CustomerManagement" element={<CustomerManagement />} />
        <Route path="/CarManagement" element={<CarManagement />} />
        <Route path="/Book2" element={<Book2 />} />
        <Route path="/ServiceManagement" element={<ServiceManagement />} />
        <Route path="/Workday" element={<Workday />} />
        <Route path="/Employee" element={<Employee />} />
        <Route path="/PartsManager" element={<PartsManager />} />
        <Route path="/Holidays" element={<Holidays />} />
        <Route path="/Create_garages" element={<Create_garages />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/Create_Quotation" element={<Create_Quotation />} />
        <Route path="/Create_car_receipt" element={<Create_car_receipt />} />
      </Routes>
      </div>
    </>
  );
}
