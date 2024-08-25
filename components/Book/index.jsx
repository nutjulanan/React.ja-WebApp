import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Daywork from './Daywork';
const VITE_API_URL = import.meta.env.VITE_API_URL; // ตั้งค่า URL ของ API

const Book = () => {
    const [jobs, setJobs] = useState([]); // State สำหรับจัดเก็บข้อมูลรายการซ่อม

    // ฟังก์ชันสำหรับดึงข้อมูลรายการซ่อมจาก API
    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAlljob`);
            setJobs(response.data); // จัดเก็บข้อมูลรายการซ่อมไว้ใน state
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchJobs(); // เรียกใช้ฟังก์ชัน fetchJobs หลังจาก component ถูกเรนเดอร์
    }, []);

    // ส่วนของการแสดงผล
    return (
        <div className="container mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">รายการซ่อม</h3>
            <div className="container mx-auto ">
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
                            <th className="border p-2 w-32">หมายเลขซ่อมบำรุง</th>
                            
                            <th className="border p-2 w-48">เลขทะเบียนรถยนต์</th>
                            <th className="border p-2">สถานะการซ่อม</th>
                            <th className="border p-2">ข้อมูลซ่อมบำรุงซ่อม</th>
                            {/* <th className="border p-2 w-32">หมายเหตุ</th> */}
                            <th className="border p-2">รถเข้าเข้าเมื่อ</th>
                            <th className="border p-2">วันที่รถออก</th>
                            <th className="border p-2w-32">แก้ไขล่าสุดโดย</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border p-2">{"JOB NO." + job.id}</td>
                                
                                <td className="border p-2">{job.car_id}</td>
                                <td className="border p-2">{job.job_status}</td>
                                <td className="border p-2">{job.repair_details}</td>
                                {/* <td className="border p-2">{job.customer_feedback}</td> */}
                                <td className="border p-2">{job.car_in ? format(new Date(job.car_in), "dd-MM-yyyy") : " "}</td>
                                <td className="border p-2">{job.car_out ? format(new Date(job.car_out), "dd-MM-yyyy") : " "}</td>
                                <td className="border p-2">{job.update_record}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Daywork/>
            {/* <div>
            <iframe width="320" height="875" src="https://oil-price.bangchak.co.th/BcpOilPrice1/th" frameborder="0"></iframe>
            </div> */}
            <div>
            <iframe width="100%" height="420" v-lazy-load data-src="https://www.pttor.com/oil_price_board?lang=en" frameborder="0"></iframe>
            </div>
        </div>
    );
};

export default Book;
