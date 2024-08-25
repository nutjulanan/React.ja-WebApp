import React, { useState } from 'react';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Create_car_receipt_edit(props) {


    const handleChange = (e) => {
        const { name, value } = e.target;
        props.setNewcar_receipt({ ...props.Newcar_receipt, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const data_id = JSON.parse(localStorage.getItem('data_id'));
        props.Newcar_receipt.update_record = data_id.full_name;

        try {
            // Adjust the URL to match your API deployment
            const response = await axios.put(`${VITE_API_URL}/Updatecar_receipt/${props.Newcar_receipt.id}`, props.Newcar_receipt);
            console.log('Car receipt updated successfully:', response.data);
            alert('Car receipt updated successfully!');
            props.setDisplayComponent("Create_car_receipt_search");
            // Optionally reset form or handle further logic here
        } catch (error) {
            console.error('Error updating car receipt:', error);
            alert('Failed to update car receipt.');
        }
    };

    return (
        <div className="max-w-lg mx-auto ">
            <form onSubmit={handleSubmit} className="">
                <h1>ลูกค้า</h1>
                <input type="text" name="customer_id" value={props.Newcar_receipt.customer_id} onChange={handleChange} placeholder="โปรดใส่รหัสลูกค้า" className="input input-bordered w-full max-w-xs" required /> <br></br><br></br>

                <h1>หมายเลขรายการซ่อม</h1>
                <input type="text" name="job_id" value={props.Newcar_receipt.job_id} onChange={handleChange} placeholder="JOB NO." className="input input-bordered w-full max-w-xs" required /> <br></br><br></br>

                <h1>ชำระแล้วจำนวน</h1>
                <input type="number" name="estimated_cost" value={props.Newcar_receipt.estimated_cost} onChange={handleChange} placeholder="จำนวนเงิน" className="input input-bordered w-full max-w-xs" required /> <br></br><br></br>

                <h1>ลายเซ็น</h1>
                <select name="receipt_status" value={props.Newcar_receipt.receipt_status} onChange={handleChange} className="select select-bordered w-full max-w-xs" required >
                    <option value="">Select Receipt Status</option>
                    <option value="ไม่มีลายเซ็น">ไม่มีลายเซ็น</option>
                    <option value="เซ็นเรียบร้อย">เซ็นเรียบร้อย</option>
                </select><br></br><br></br>

                <h1>วันที่</h1>
                <input type="date" name="reception_date" value={props.Newcar_receipt.reception_date} onChange={handleChange} required /><br></br><br></br>
                <div className="flex items-center justify-center space-x-2"> 
                    <button className="btn btn-success m-2" type="submit">บันทึก</button>
                    <button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Create_car_receipt_search")}>ยกเลิก</button>
                </div>
            </form>
        </div>
    );
}

export default Create_car_receipt_edit;
