import axios from 'axios';
import React, { useEffect, useState } from 'react';

import RolesPermissions_search from './RolesPermissions_search';
import RolesPermissions_add from './RolesPermissions_add'; 
import RolesPermissions_edit from './RolesPermissions_edit'; 

import Employee from '..';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function RolesPermissions(props) {  

  const [displayComponent, setDisplayComponent] = useState("RolesPermissions_search");
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [NewRolesPermissions, setNewRolesPermissions] = useState({
    id : null,
    name_role: "",
    inventorystock: false,   
    job: false,
    carandcustomer: false,
    quotations: false,
    requisitions: false,
    vehiclereceipts: false,
    repairappointments: false,
    garages: false,
    update_record : null
  });
  
  const [data, setData] = useState([])
  const [records, setRecords] = useState(data)
  
  const fetchAPI = async () => {
    const res = await axios.get(`${VITE_API_URL}/roles_permissions`)
    setData(res.data)
    setData(currentData => currentData.sort((a, b) => a.id - b.id));
    setRecords(res.data)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
        

        {displayComponent === "RolesPermissions_add" && <RolesPermissions_add fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent}/>}
        {displayComponent === "RolesPermissions_search" && <RolesPermissions_search fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} data={data} NewRolesPermissions={NewRolesPermissions} setNewRolesPermissions={setNewRolesPermissions}/>}
        {displayComponent === "RolesPermissions_edit" && <RolesPermissions_edit fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} NewRolesPermissions={NewRolesPermissions} setNewRolesPermissions={setNewRolesPermissions}/>}
        {displayComponent === "Employee" && <Employee />}

        </>
    );
  }
  
