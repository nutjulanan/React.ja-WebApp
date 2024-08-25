import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Employee_edit from './Employee_edit';
import Employee_search from './Employee_search';
import Employee_Add from './Employee_Add';

import RolesPermissions from './RolesPermissions';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Employee(props) {

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      if (!all_role.some(permission => permission["garages"] === true)) {
        navigate('/garage');
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }
  useEffect(() => {
    fetchPermission()
  }, [])
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const [displayComponent, setDisplayComponent] = useState("Employee_search");

  // console.log(VITE_API_URL)

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [NewWorkforceInformation, setNewWorkforceInformation] = useState({
    id: "",
    national_id: "",
    nameprefix: "",
    full_name: "",
    age: null,
    sex: "",
    email: "",
    telephone_number: "",
    secondarycontact: "",
    address: "",
    jobexperience: "",
    salary: null,
    totalvacationdays: null,
    start_work_date: null,
    end_of_work_day: null,
    update_record: null
  });


  const [data, setData] = useState([])
  const [records, setRecords] = useState(data)

  const fetchAPI = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/fetchAllWorkforceInformation`);
      let updatedData = [];
      const result = res.data;
      for (const item of result) {
        const response = await axios.get(`${VITE_API_URL}/work_roles_permissions/${item.id}`);
        const additionalInfos = response.data; // นี่เป็น array ตอนนี้
        let role_text = "";
        for (const additionalInfo of additionalInfos) { // Loop ผ่านทุกๆ additionalInfo
          // ตรวจสอบ role_id ที่ได้รับจาก response

          // ตรวจสอบก่อนว่า additionalInfo.role_id ไม่ใช่ undefined
          if (additionalInfo.role_id !== undefined) {
            const responseroles = await axios.get(`${VITE_API_URL}/fetchroles_permissionsById/${additionalInfo.role_id}`);
            const additionalInforoles = responseroles.data;
            role_text += additionalInforoles.name_role + " ";

          } else {
            // ทำอย่างอื่นถ้า role_id ไม่ได้ถูกกำหนด
            console.error('role_id is undefined for item:', item);
          }
        }
        updatedData.push({
          ...item,
          additional_info: role_text // เพิ่มข้อมูลใหม่ที่คุณต้องการ
        });
      }

      setData(updatedData); // ปรับปรุง state ข้อมูล
      setData(currentData => currentData.sort((a, b) => a.id - b.id));
      setRecords(updatedData); // ปรับปรุง records state
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>

      {displayComponent === "Employee_search" && <Employee_search records={records} setRecords={setRecords} data={data} fetchAPI={fetchAPI} NewWorkforceInformation={NewWorkforceInformation} setNewWorkforceInformation={setNewWorkforceInformation} setDisplayComponent={setDisplayComponent} />}
      {displayComponent === "Employee_Add" && <Employee_Add fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} />}
      {displayComponent === "Employee_edit" && <Employee_edit fetchAPI={fetchAPI} NewWorkforceInformation={NewWorkforceInformation} setNewWorkforceInformation={setNewWorkforceInformation} setDisplayComponent={setDisplayComponent} />}

      {displayComponent === "RolesPermissions" && <RolesPermissions fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} />}
    </>
  );
}

