import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./Employee_search.css"
const VITE_API_URL = import.meta.env.VITE_API_URL;

import { format } from "date-fns";

export default function Employee_search(props) {



  const deleteWorkforceInformation = async (id) => {
    try {
      const response = await axios.delete(`${VITE_API_URL}/deleteWorkforceInformation/${id}`);
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

  const editWorkforceInformation = async (element) => {
    props.setNewWorkforceInformation({
      id: element.id,
      national_id: element.national_id,
      nameprefix: element.nameprefix,
      full_name: element.full_name,
      age: element.age,
      sex: element.sex,
      email: element.email,
      telephone_number: element.telephone_number,
      secondarycontact: element.secondarycontact,
      address: element.address,
      jobexperience: element.jobexperience,
      salary: element.salary,
      totalvacationdays: element.totalvacationdays,
      start_work_date: element.start_work_date,
      end_of_work_day: element.end_of_work_day
    });
  };


  useEffect(() => {
    props.fetchAPI()
  }, [])

  const SearchData = (e) => {
    const filter = props.data.filter(element =>

      element.id.toString().includes(e.target.value) ||
      element.national_id.toLowerCase().includes(e.target.value) ||
      element.nameprefix.toLowerCase().includes(e.target.value) ||
      element.full_name.toLowerCase().includes(e.target.value) ||
      element.age.toString().includes(e.target.value) ||
      element.sex.toLowerCase().includes(e.target.value) ||
      element.email.toLowerCase().includes(e.target.value) ||
      element.telephone_number.toLowerCase().includes(e.target.value) ||
      element.secondarycontact.toLowerCase().includes(e.target.value) ||
      element.address.toLowerCase().includes(e.target.value) ||
      element.jobexperience.toLowerCase().includes(e.target.value) ||
      element.salary.toString().includes(e.target.value)

    )
    // const filter = data.filter(element =>
    //   Object.values(element).some(value =>
    //     value.toString().toLowerCase().includes(e.target.value.toLowerCase())
    //   )
    // );

    setRecords(filter)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">ระบบจัดการบัญชีพนักงาน</h1>
      <br></br>
      <div className="flex justify-center items-center">
      <button className="btn btn-primary m-2" onClick={() => props.setDisplayComponent("RolesPermissions")}>จัดการตำแหน่งงาน</button>
      </div>

      <input type="text" placeholder='Search...' onChange={SearchData} className='form-control' />
      <table className='table table-xs'>
        <thead>
          <tr>
            <th>รหัส ID</th>
            <th>หมายเลขบัตรประชาชน</th>
            <th>คำนำหน้า</th>
            <th>ชื่อ</th>
            <th>อายุ</th>
            <th>เพศ</th>
            <th>Email</th>
            <th>เบอร์โทรศัพท์</th>
            <th>เบอร์สำรอง</th>
            <th className=''>ที่อยู่</th>
            <th>ประสบการณ์</th>
            <th>ค่าแรง</th>
            {/* <th>จำนวนวันลาหยุด</th> */}
            <th>วันเริ่มทำงาน</th>
            <th>วันเลิกทำงาน</th>
            <th>ตำแหน่ง</th>
            <th>แก้ไขล่าสุดโดย</th>

          </tr>
        </thead>
        <tbody>
          {
            props.records.map((element, index) => (
              <tr key={index}>
                <td>{element.id}</td>
                <td>{element.national_id}</td>
                <td>{element.nameprefix}</td>
                <td>{element.full_name}</td>
                <td>{element.age}</td>
                <td>{element.sex}</td>
                <td>{element.email}</td>
                <td>{element.telephone_number}</td>
                <td>{element.secondarycontact}</td>
                <td className='som-text w-24'>{element.address}</td>
                <td>{element.jobexperience}</td>
                <td>{element.salary}</td>
                {/* <td>{element.totalvacationdays}</td> */}
                <td> {element.start_work_date ? format(new Date(element.start_work_date), "dd-MM-yyyy") : " "}</td>
                <td> {element.end_of_work_day ? format(new Date(element.end_of_work_day), "dd-MM-yyyy") : " "}</td>

                <td>{element.additional_info}</td>
                <td>{element.update_record}</td>
                <td> <button className="btn btn-sm   m-2" onClick={() => { editWorkforceInformation(element); props.setDisplayComponent("Employee_edit"); }} > แก้ไข  </button> </td>
                <td><button className="btn btn-sm btn-error m-2" onClick={() => deleteWorkforceInformation(element.id)}>ลบ </button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="flex justify-center items-center">
  <button className="btn btn-success m-2" onClick={() => props.setDisplayComponent("Employee_Add")}>เพิ่ม</button>
</div>
    </>
  );
}
