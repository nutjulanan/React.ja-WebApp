import React, { useState } from 'react';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Create_car_receipt_add(props) {
    const [formData, setFormData] = useState({
        customer_id: '',
        job_id: '',
        estimated_cost: 0,
        receipt_status: '',
        reception_date: '',
        update_record: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const data_id = JSON.parse(localStorage.getItem('data_id'));
        formData.update_record = data_id.full_name;
        try {
            // Adjust the URL to match your API deployment
            const response = await axios.post(`${VITE_API_URL}/Addcar_receiptdata`, formData);
            console.log('Car receipt added successfully:', response.data);
            alert('Car receipt added successfully!');
            props.setDisplayComponent("Create_car_receipt_search");
            props.fetchAPI();
            // Optionally reset form or handle further logic here
        } catch (error) {
            console.error('Error adding new car receipt:', error);
            alert('Failed to add car receipt.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>ลูกค้า</h1>
                <input type="text" name="customer_id" value={formData.customer_id} onChange={handleChange} placeholder="โปรดใส่รหัสลูกค้า" className="input input-bordered w-full max-w-xs" required /><br></br><br></br>

                <h1>หมายเลขรายการซ่อม</h1>
                <input type="text" name="job_id" value={formData.job_id} onChange={handleChange} placeholder="JOB NO." className="input input-bordered w-full max-w-xs" required /><br></br><br></br>

                <h1>ชำระแล้วจำนวน</h1>
                <input type="number" name="estimated_cost" value={formData.estimated_cost} onChange={handleChange} placeholder="จำนวนเงิน" className="input input-bordered w-full max-w-xs" required /><br></br><br></br>

                <h1>ลายเซ็น</h1>
                <select name="receipt_status" value={formData.receipt_status} onChange={handleChange} className="select select-bordered w-full max-w-xs" required >
                    <option value="">ลายเซ็น</option>
                    <option value="ไม่มีลายเซ็น">ไม่มีลายเซ็น</option>
                    <option value="เซ็นเรียบร้อย">เซ็นเรียบร้อย</option>
                </select><br></br><br></br>

                <h1>วันที่</h1>
                <input type="date" name="reception_date" value={formData.reception_date} onChange={handleChange} required /><br></br><br></br>
                <div className="flex items-center justify-center space-x-2"> 
                <button className="btn btn-success m-2" type="submit">สร้างใบรับรถ</button><br></br><br></br>
                <button className="btn  m-2" onClick={() => props.setDisplayComponent("Create_car_receipt_search")}>ยกเลิก</button>
                </div>

            </form>
        </div>
    );
}

export default Create_car_receipt_add;
