import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Holidays_search from './Holidays_search';
import Holidays_add from './Holidays_add';
import Holidays_edit from './Holidays_edit';

const VITE_API_URL = import.meta.env.VITE_API_URL;

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';




export default function Holidays(props) {

  const [displayComponent, setDisplayComponent] = useState("Holidays_search");


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [NewHolidays, setNewHolidays] = useState({
    id: null,
    date: null,
    nameholidays: "",
    workdaystatus: false,
    update_record: false
  });

  const [data, setData] = useState([])
  const [records, setRecords] = useState(data)

  const fetchAPI = async () => {
    const res = await axios.get(`${VITE_API_URL}/fetchAllHolidays`)
    setData(res.data)
    setRecords(res.data)
  }




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





  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <h1 className="text-3xl font-semibold mb-5">วันหยุด</h1>
      {displayComponent === "Holidays_search" && <Holidays_search fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} data={data} NewHolidays={NewHolidays} setNewHolidays={setNewHolidays} />}
      {displayComponent === "Holidays_add" && <Holidays_add fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} />}
      {displayComponent === "Holidays_edit" && <Holidays_edit fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} NewHolidays={NewHolidays} setNewHolidays={setNewHolidays} />}
      {/* {displayComponent === "Holidays" && <Holidays />} */}
    </>
  );
}

