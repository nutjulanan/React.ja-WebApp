import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Create_Quotation_search from './Create_Quotation_search';
import Create_Quotation_add from './Create_Quotation_add';
import Create_Quotation_edit from './Create_Quotation_edit';

export default function Create_Quotation(props) {
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
            if (!all_role.some(permission => permission["quotations"] === true)) {
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

    const [displayComponent, setDisplayComponent] = useState("Create_Quotation_search");
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [NewQuotation, setNewQuotation] = useState({
        id: null,
        customer_id: null,
        job_id: null,
        quotation_date: null,
        details: null,
        update_record: null
    });

    const [data, setData] = useState([])
    const [records, setRecords] = useState(data)

    const fetchAPI = async () => {
        const res = await axios.get(`${VITE_API_URL}/fetchAllquotation`)

        const result = res.data;
        let updatedData = [];
        for (const item of result) {
            if (item.customer_id != null) {
                const response_name = await axios.get(`${VITE_API_URL}/fetchAllcustomerById/${item.customer_id}`);

                updatedData.push({
                    ...item,
                    full_name: response_name.data.full_name // เพิ่มข้อมูลใหม่ที่คุณต้องการ
                });
            } else {
                updatedData.push({
                    ...item,
                    full_name: "ไม่มีข้อมูลลูกค้า"
                });
            }

        }

        setData(updatedData)
        setRecords(updatedData)
    }

    useEffect(() => {
        fetchAPI()
    }, [])

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            {displayComponent === "Create_Quotation_search" && <Create_Quotation_search fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} setRecords={setRecords} data={data} NewQuotation={NewQuotation} setNewQuotation={setNewQuotation} />}
            {displayComponent === "Create_Quotation_add" && <Create_Quotation_add fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} />}
            {displayComponent === "Create_Quotation_edit" && <Create_Quotation_edit fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} NewQuotation={NewQuotation} setNewQuotation={setNewQuotation} />}


        </>
    );
}

