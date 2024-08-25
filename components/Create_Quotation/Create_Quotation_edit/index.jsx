import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { format } from "date-fns";

export default function Create_Quotation_edit(props) {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data_id = JSON.parse(localStorage.getItem('data_id'));
    props.NewQuotation.update_record = data_id.full_name
    try {
      const response = await axios.put(`${VITE_API_URL}/Updatequotation/${props.NewQuotation.id}`, props.NewQuotation);
      alert('Quotation updated successfully');
      console.log(response.data);

      props.setNewQuotation({
        id: null,
        customer_id: null,
        job_id: null,
        quotation_date: null,
        details: null,
        update_record: null
      });

      props.setDisplayComponent("Create_Quotation_search")
    } catch (error) {
      console.error('Error updating quotation:', error);
      alert('Failed to update quotation');
    }
  };

  const handleChange = (e) => {
    props.setNewQuotation({ ...props.NewQuotation, [e.target.name]: e.target.value });
  };


  return (
    <>
      <div class="flex justify-center items-center h-screen">
  <div class="max-w-screen-lg">
    <h2 class="text-center">แก้ไขข้อมูลใบเสนอราคา</h2>
    <form onSubmit={handleSubmit} class="mt-4">
      <h1>ลูกค้า</h1>
      <input name="customer_id" value={props.NewQuotation.customer_id} onChange={handleChange} placeholder="โปรดใส่รหัสลูกค้า" class="input input-bordered w-full max-w-xs" /><br /><br />
      <h1>หมายเลขรายการซ่อม</h1>
      <input name="job_id" value={props.NewQuotation.job_id} onChange={handleChange} placeholder="JOB NO." class="input input-bordered w-full max-w-xs" /><br /><br />
      <h1>วันที่</h1>
      <input type="date" name="quotation_date" value={props.NewQuotation.quotation_date} onChange={handleChange} placeholder="Quotation Date" required /><br /><br />
      <h1>รายละเอียด</h1>
      <textarea name="details" value={props.NewQuotation.details} onChange={handleChange} placeholder="Details" class="input input-bordered w-full max-w-xs" /><br /><br />
      <div class="flex justify-center space-x-2">
        <button class="btn btn-success" type="submit">บันทึก</button>
        <button class="btn" onClick={() => props.setDisplayComponent("Create_Quotation_search")}>ยกเลิก</button>
      </div>
    </form>
  </div>
</div>

    </>
  );
}
