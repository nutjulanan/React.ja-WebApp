import React, { useEffect, useState } from 'react';
import axios from 'axios';

import JobsTable_search from "./JobsTable_search"
import JobsTable_edit from "./JobsTable_edit"

import JobsTable_bill from "./JobsTable_bill"
import JobsTable_car_receipt from "./JobsTable_car_receipt"
import JobsTable_quotation from "./JobsTable_quotation"
import JobPictures from "../JobPictures"
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables


import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const JobsTable = () => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [displayComponent, setDisplayComponent] = useState("JobsTable_search");

    const [editFormVisible, setEditFormVisible] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);

    const [data, setData] = useState([])
    const [records, setRecords] = useState(data)
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchAPI = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAlljob`);
            const result = response.data;
            let updatedData = [];
            for (const item of result) {
                const response_name = await axios.get(`${VITE_API_URL}/fetchWorkforceInformationById/${item.responsible_employee_id}`);

                updatedData.push({
                    ...item,
                    full_name: response_name.data.full_name // เพิ่มข้อมูลใหม่ที่คุณต้องการ
                });
            }


            setData(updatedData);
            setData(currentData => currentData.sort((a, b) => a.id - b.id));

            setRecords(updatedData);

        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

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
    return (
        <>
            {displayComponent === "JobsTable_search" && <JobsTable_search fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} setRecords={setRecords} data={data} setCurrentJob={setCurrentJob} setEditFormVisible={setEditFormVisible} />}
            {displayComponent === "JobsTable_edit" && <JobsTable_edit fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} editFormVisible={editFormVisible} setEditFormVisible={setEditFormVisible} currentJob={currentJob} setCurrentJob={setCurrentJob} />}
            {displayComponent === "JobsTable_bill" && <JobsTable_bill fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} currentJob={currentJob} setCurrentJob={setCurrentJob} />}

            {displayComponent === "JobsTable_car_receipt" && <JobsTable_car_receipt fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} currentJob={currentJob} setCurrentJob={setCurrentJob} />}
            {displayComponent === "JobsTable_quotation" && <JobsTable_quotation fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} currentJob={currentJob} setCurrentJob={setCurrentJob} />}
            <JobPictures/>
        </>
    );
};

export default JobsTable;