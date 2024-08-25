import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Employee_search(props) {


  const deleteRolesPermissions = async (id) => {
    try {
      const response = await axios.delete(`${VITE_API_URL}/Deleteroles_permissions/${id}`);
      console.log('Data deleted successfully:', response.data);
      props.fetchAPI()
    } catch (error) {
      if (error.response) {
        console.error('Data not found or already deleted', error.response.data);
      } else if (error.request) {
        console.error('No response was received', error.request);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  const editRolesPermissions = async (element) => {
    props.setNewRolesPermissions({
      id: element.id,
      name_role: element.name_role,
      inventorystock: element.inventorystock,
      job: element.job,
      carandcustomer: element.carandcustomer,
      quotations: element.quotations,
      requisitions: element.requisitions,
      vehiclereceipts: element.vehiclereceipts,
      repairappointments: element.repairappointments,
      garages: element.garages
    });
  };

  useEffect(() => {
    props.fetchAPI()
  }, [])


  return (
    <>
      <br></br>
      <h1 className="text-2xl font-bold mb-4 text-center">ระบบจัดการสิทธิ์การใช้งานในระบบ</h1>

      {/* <input type="text" placeholder='Search...' onChange={SearchData} className='form-control' /> */}
      <table className='table'>
  <thead>
    <tr>
      <th className="px-4 py-2">รหัส ID</th>
      <th className="px-4 py-2">ตำแหน่ง</th>
      <th className="px-4 py-2">ใบเสนอราคา</th>
      <th className="px-4 py-2">ใบรับรถ</th>
      <th className="px-4 py-2">คลังอุปกรณ์และอะไหล่</th>
      <th className="px-4 py-2">ลูกค้าและรถยนต์</th>
      <th className="px-4 py-2">รายการซ่อม</th>
      <th className="px-4 py-2">อัพเดทรายการซ่อม</th>
      <th className="px-4 py-2">ข้อมูลอุ่</th>
      <th className="px-4 py-2">แก้ไข</th>
      <th className="px-4 py-2">ลบ</th>
    </tr>
  </thead>
  <tbody>
    {props.records.map((element, index) => (
      <tr key={index}>
        <td className="px-4 py-2">{element.id}</td>
        <td className="px-4 py-2">{element.name_role}</td>
        {/* Use checkboxes to display boolean values. Make them disabled to only reflect the state. */}
        <td className="px-4 py-2"><input type="checkbox" checked={element.quotations} disabled /></td>
        <td className="px-4 py-2"><input type="checkbox" checked={element.vehiclereceipts} disabled /></td>
        <td className="px-4 py-2"><input type="checkbox" checked={element.inventorystock} disabled /></td>
        <td className="px-4 py-2"><input type="checkbox" checked={element.carandcustomer} disabled /></td>
        <td className="px-4 py-2"><input type="checkbox" checked={element.job} disabled /></td>
        <td className="px-4 py-2"><input type="checkbox" checked={element.repairappointments} disabled /></td>
        <td className="px-4 py-2"><input type="checkbox" checked={element.garages} disabled /></td>
        {/* Your existing code for buttons can remain unchanged */}
        <td className="px-4 py-2">
          <button className="btn btn-sm " onClick={() => { editRolesPermissions(element); props.setDisplayComponent("RolesPermissions_edit"); }}>แก้ไข</button>
        </td>
        <td className="px-4 py-2">
          {/* <button className="btn btn-sm btn-error" onClick={() => deleteRolesPermissions(element.id)}>ลบ</button>
          <button className="btn btn-sm btn-error" onClick={() => deleteRolesPermissions(element.id)}>ลบ</button> */}

          <button className="btn btn-sm btn-error" onClick={() => {
      if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
        deleteRolesPermissions(element.id);
      }}}>ลบ</button>
          
        </td>
      </tr>
    ))}
  </tbody>
</table>
<div className="flex items-center justify-center space-x-2"> 
      <button className="btn btn-success m-2" onClick={() => props.setDisplayComponent("RolesPermissions_add")}>เพิ่ม</button>
      <button className="btn  m-2" onClick={() => props.setDisplayComponent("Employee")}>กลับ</button> 
      </div><br></br><br></br><br></br>

      <h1 className="text-xl font-bold mb-2">สิทธิ์ ใบเสนอราคา สามารถ สร้าง แก้ไข ลบ สร้างเอกสารของข้อมูลใบเสนอราคาได้ และ สามารถบันทึกและดูข้อมูลรูปภาพของใบเสนอราคาได้</h1><br></br>

      <h1 className="text-xl font-bold mb-2">สิทธิ์ ใบรับรถ	สามารถ สร้าง แก้ไข ลบ สร้างเอกสารของข้อมูลใบรับรถได้ และ สามารถบันทึกและดูข้อมูลรูปภาพของใบรับรถได้</h1><br></br>
      <h1 className="text-xl font-bold mb-2">สิทธิ์ คลังอุปกรณ์และอะไหล่ สามารถ สร้าง แก้ไข ลบ ข้อมูลอะไหล่ในคลังและข้อมูลบริการซ่อมได้ </h1><br></br>

      <h1 className="text-xl font-bold mb-2">สิทธิ์ ลูกค้าและรถยนต์	 สามารถ สร้าง แก้ไข ลบ ข้อมูลรถยนต์และข้อมูลลูกค้าได้ </h1><br></br>

      <h1 className="text-xl font-bold mb-2">สิทธิ์ รายการซ่อม สามารถใช้งานระบบจัดการรายการซ่อมได้ </h1><br></br>

      <h1 className="text-xl font-bold mb-2">สิทธิ์ อัพเดทรายการซ่อม สามารถใช้งานระบบ อัพเดทข้อมูลการซ่อมได้</h1><br></br>

      <h1 className="text-xl font-bold mb-2">สิทธิ์ ข้อมูลอู่ซ่อม สามารถใช้งานระบบได้ดังต่อไปนี้ ตารางวันทำงาน สร้างวันหยุด การจองเข้าซ่อม ระบบจัดการพนักงาน ตั้งค่าเว็บไซต์ </h1><br></br>

    </>
  );
}
