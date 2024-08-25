import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Create_car_receipt_search from './Create_car_receipt_search';
import Create_car_receipt_add from './Create_car_receipt_add';
import Create_car_receipt_edit from './Create_car_receipt_edit';

export default function Create_car_receipt(props) {

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
            if (!all_role.some(permission => permission["vehiclereceipts"] === true)) {
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



    const [displayComponent, setDisplayComponent] = useState("Create_car_receipt_search");
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [Newcar_receipt, setNewcar_receipt] = useState({
        customer_id: '',
        job_id: '',
        estimated_cost: '',
        receipt_status: '',
        reception_date: '',
        update_record: '',
    });

    const [data, setData] = useState([])
    const [records, setRecords] = useState(data)

    const fetchAPI = async () => {
        const res = await axios.get(`${VITE_API_URL}/fetchAllcar_receipt`)

        const result = res.data;
        let updatedData = [];
        for (const item of result) {
            const response_name = await axios.get(`${VITE_API_URL}/fetchAllcustomerById/${item.customer_id}`);

            updatedData.push({
                ...item,
                full_name: response_name.data.full_name // เพิ่มข้อมูลใหม่ที่คุณต้องการ
            });
        }

        setData(updatedData)
        setData(currentData => currentData.sort((a, b) => a.id - b.id));
        setRecords(updatedData)
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            {displayComponent === "Create_car_receipt_search" && <Create_car_receipt_search fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} setRecords={setRecords} data={data} Newcar_receipt={Newcar_receipt} setNewcar_receipt={setNewcar_receipt} />}
            {displayComponent === "Create_car_receipt_add" && <Create_car_receipt_add fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} />}
            {displayComponent === "Create_car_receipt_edit" && <Create_car_receipt_edit fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} Newcar_receipt={Newcar_receipt} setNewcar_receipt={setNewcar_receipt} />}


        </>
    );
}

