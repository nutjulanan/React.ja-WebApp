import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Reservation_search from './Reservation_search';
import Reservation_edit from './Reservation_edit';

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

export default function Reservation(props) {
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


  const [displayComponent, setDisplayComponent] = useState("Reservation_search");


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [NewReservation, setNewReservation] = useState({
    id: null,
    fullname: null,
    E_mail: null,
    tele_number: null,
    date: null,
    WorkdayStatus: null,
    response_details: null,
    reservation_type: null,
    details: null,
    status: null,
    update_record: null
  });

  const [data, setData] = useState([])
  const [records, setRecords] = useState(data)

  const fetchAPI = async () => {
    const res = await axios.get(`${VITE_API_URL}/fetchAllReservation`)
    setData(res.data)
    setRecords(res.data)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <><h1 className="text-3xl font-semibold mb-5">การจองเข้าซ่อม</h1>
      {displayComponent === "Reservation_search" && <Reservation_search fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} data={data} NewReservation={NewReservation} setNewReservation={setNewReservation} />}
      {displayComponent === "Reservation_edit" && <Reservation_edit fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} NewReservation={NewReservation} setNewReservation={setNewReservation} />}
      {/* {displayComponent === "Reservation" && <Reservation />} */}
    </>
  );
}

