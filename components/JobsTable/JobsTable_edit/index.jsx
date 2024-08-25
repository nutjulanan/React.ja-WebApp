import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../JobsTable.css';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

import { format } from "date-fns";

const JobsTable_edit = (props) => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบและแก้ไขข้อมูลที่จะส่งถ้าจำเป็น
        const updatedJob = {
            ...props.currentJob,
            responsible_Employee_id: parseInt(props.currentJob.responsible_employee_id, 10) || 0, // ตรวจสอบค่า NaN
        };
        const data_id = JSON.parse(localStorage.getItem('data_id'));
        updatedJob.update_record = data_id.full_name
        try {
            const response = await axios.put(`${VITE_API_URL}/Updatejobdata/${updatedJob.id}`, updatedJob);
            props.setEditFormVisible(false); // Hide the edit form
            props.setDisplayComponent("JobsTable_search");
            props.fetchAPI();

        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // ตรวจสอบก่อนแปลงค่าเพื่อให้แน่ใจว่า responsible_employee_id แปลงเป็นตัวเลข
        const updatedValue = name === 'responsible_employee_id' ? parseInt(value, 10) || 0 : value;
        props.setCurrentJob(prev => ({ ...prev, [name]: updatedValue }));
    };

    useEffect(() => {
        props.fetchAPI();
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <h3 className="text-2xl font-bold mb-4">ระบบจัดการรายการซ่อม</h3>
            <div className="container mx-auto px-4 py-2">

                {props.editFormVisible && (
                    <div className="flex justify-center items-center h-screen bg-gray-100">
                        <div className="container p-5 bg-white rounded-lg shadow-xl max-w-4xl">
                            <form onSubmit={handleEditSubmit} >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block"> <span className="text-gray-700">รหัสพนักงาน</span>
                                        <input type="text" name="responsible_employee_id" value={props.currentJob.responsible_employee_id || ''} onChange={handleChange} className="input input-bordered w-full" />
                                    </label>

                                    <label className="block"> <span className="text-gray-700">เลขทะเบียนรถ</span>
                                        <input type="text" name="car_id" value={props.currentJob.car_id || ''} onChange={handleChange} className="input input-bordered w-full" />
                                    </label>

                                    <label className="block"> <span className="text-gray-700">รถ-เข้า</span>
                                        <input type="date" name="car_in" value={format(new Date(props.currentJob.car_in), "yyyy-MM-dd") || ''} onChange={handleChange} className="input input-bordered w-full" />
                                    </label>

                                </div>

                                <div>
                                    <label className="block"> <span className="text-gray-700">สถานะ</span>
                                        <select name="job_status" value={props.currentJob.job_status || ''} onChange={handleChange} className="select select-bordered w-full" >
                                            <option value="รอดำเนินการ">รอดำเนินการ</option>
                                            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                                            <option value="ยกเลิก">ยกเลิก</option>
                                        </select>
                                    </label>

                                    <label className="block"> <span className="text-gray-700">รถ-ออก </span>
                                        <input type="date" name="car_out" value={format(new Date(props.currentJob.car_out), "yyyy-MM-dd") || ''} onChange={handleChange} className="input input-bordered w-full" />
                                    </label>
                                    {/* 
                                    <label className="block"> <span className="text-gray-700">ผู้บันทึก</span>
                                        <input type="text" name="update_record" value={props.currentJob.update_record || ''} onChange={handleChange} className="input input-bordered w-full" />
                                    </label> */}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block">
                                        <span className="text-gray-700">รายละเอียด</span>
                                        <textarea name="repair_details" value={props.currentJob.repair_details || ''} onChange={handleChange} className="textarea textarea-bordered w-full" />
                                    </label>

                                    <label className="block"> <span className="text-gray-700">ข้อเสนอ</span>
                                        <textarea name="customer_feedback" value={props.currentJob.customer_feedback || ''} onChange={handleChange} className="textarea textarea-bordered w-full" />
                                    </label>
                                </div>

                                </div>
                                <div className="flex items-center justify-center space-x-2"> 
                                    <button type="submit" className="btn btn-primary mt-4 w-full md:w-auto">บันทึก</button>
                                    <button onClick={() => { props.setDisplayComponent("JobsTable_search"); }} type="button" className="btn  mt-4 w-full md:w-auto">ยกเลิก</button>
                                </div>
                            </form>
                            {/* <button onClick={() => { props.setDisplayComponent("JobsTable_search"); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 w-24 rounded mr-2">ยกเลิก</button> */}


                        </div>
                    </div>

                )}
            </div>
        </>
    );
};

export default JobsTable_edit;