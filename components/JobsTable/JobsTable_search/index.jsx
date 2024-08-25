import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../JobsTable.css';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

import { format } from "date-fns";

const JobsTable_search = (props) => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [permissions, setPermissions] = useState(null);

    const hasPermission = (feature) => {
        // สมมติว่า permissions เป็น state ที่เก็บอาร์เรย์ของสิทธิ์ผู้ใช้
        return permissions?.some(permission => permission[feature] === true);
    };

    const fetchpermission = async () => {
        try {

            const data_id = JSON.parse(localStorage.getItem('data_id'));
            const response_work_roles_permissions = await axios.get(`${VITE_API_URL}/work_roles_permissions/${data_id.id}`);
            const additionalInfos = response_work_roles_permissions.data;

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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${VITE_API_URL}/deletejob/${id}`);
            props.fetchAPI(); // Refresh the jobs list
        } catch (error) {
            alert("ลบข้อมูลไม่สำเร็จ", error);
        }
    };

    const handleEditClick = (job) => {
        props.setCurrentJob(job); // ตรวจสอบว่า job มี responsible_employee_id อยู่แล้ว
        props.setEditFormVisible(true);
    };



    useEffect(() => {
        fetchpermission();
        props.fetchAPI();
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="container mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">ระบบจัดการรายการซ่อม</h3>
            <div className="container mx-auto px-4 py-2">
                <table className="-full border-collapse table-auto">
                    <thead>
                        <tr className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
                            <th className="border p-2 w-32">หมายเลขซ่อมบำรุง</th>
                            <th className="border p-2">พนักงานที่ดูแล</th>
                            <th className="border p-2 w-48">เลขทะเบียนรถยนต์</th>
                            <th className="border p-2">สถานะการซ่อม</th>
                            <th className="border p-2">ข้อมูลซ่อมบำรุงซ่อม</th>
                            <th className="border p-2 w-32">หมายเหตุ</th>
                            <th className="border p-2">รถเข้าเข้าเมื่อ</th>
                            <th className="border p-2">วันที่รถออก</th>
                            <th className="border p-2">แก้ไขล่าสุดโดย</th>
                            <th className="border p-2 w-32"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.records.map((element, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border p-2">{"JOB NO." + element.id}</td>
                                <td className="border p-2">{element.full_name}</td>
                                <td className="border p-2">{element.car_id}</td>
                                <td className="border p-2">{element.job_status}</td>
                                <td className="border p-2">{element.repair_details}</td>
                                <td className="border p-2">{element.customer_feedback}</td>
                                <td className="border p-2">{element.car_in ? format(new Date(element.car_in), "dd-MM-yyyy") : " "}</td>
                                <td className="border p-2">{element.car_out ? format(new Date(element.car_out), "dd-MM-yyyy") : " "}</td>

                                <td className="border p-2">{element.update_record}</td>
                                <td className="border p-2">
                                    <div className="flex items-center justify-start space-x-2">
                                        <button onClick={() => { handleEditClick(element); props.setDisplayComponent("JobsTable_edit"); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">แก้ไข</button><br></br>

                                        <button onClick={() => { if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) { handleDelete(element.id); } }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">ลบข้อมูล </button>

                                    </div>
                                    <div className="flex items-center justify-start space-x-2">
                                        <button onClick={() => { handleEditClick(element); props.setDisplayComponent("JobsTable_car_receipt"); }} className="bg-orange-400 hover:bg-orange-200 text-white font-bold py-2 px-2 w-24 rounded mr-2">ใบรับรถ</button><br></br>
                                        <button onClick={() => { handleEditClick(element); props.setDisplayComponent("JobsTable_quotation"); }} className="bg-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-2 w-24 rounded mr-2 mt-4">ใบเสนอราคา</button><br></br>

                                    </div>
                                    <div className="flex items-cente">
                                        {hasPermission('garages') && (<button onClick={() => { handleEditClick(element); props.setDisplayComponent("JobsTable_bill"); }} className=" bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">ชำระเงิน</button>)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobsTable_search;