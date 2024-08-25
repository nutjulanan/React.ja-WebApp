import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

import { format } from "date-fns";

export default function selectcar_receipt(props) {



  //   const deleteWorkforceInformation = async (id) => {
  //     try {
  //       const response = await axios.delete(`${VITE_API_URL}/deleteWorkforceInformation/${id}`);
  //       console.log('Data deleted successfully:', response.data);
  //       props.fetchAPI()
  //     } catch (error) {
  //       if (error.response) {
  //         console.error('Data not found or already deleted', error.response.data);
  //       } else if (error.request) {
  //         console.error('No response was received', error.request);
  //       } else {
  //         console.error('Error', error.message);
  //       }
  //     }
  //   };

  //   const editWorkforceInformation = async (element) => {
  //     props.setNewWorkforceInformation({
  //       id: element.id,
  //       national_id: element.national_id,
  //       nameprefix: element.nameprefix,
  //       full_name: element.full_name,
  //       age: element.age,
  //       sex: element.sex,
  //       email: element.email,
  //       telephone_number: element.telephone_number,
  //       secondarycontact: element.secondarycontact,
  //       address: element.address,
  //       jobexperience: element.jobexperience,
  //       salary: element.salary,
  //       totalvacationdays: element.totalvacationdays,
  //       start_work_date: element.start_work_date,
  //       end_of_work_day: element.end_of_work_day
  //     });
  //   };


  useEffect(() => {
    props.fetchAPI()
  }, [])

  //   const SearchData = (e) => {
  //     const filter = props.data.filter(element => 

  //       element.id.toString().includes(e.target.value) ||
  //       element.national_id.toLowerCase().includes(e.target.value) ||
  //       element.nameprefix.toLowerCase().includes(e.target.value) ||
  //       element.full_name.toLowerCase().includes(e.target.value) ||
  //       element.age.toString().includes(e.target.value) ||
  //       element.sex.toLowerCase().includes(e.target.value) ||
  //       element.email.toLowerCase().includes(e.target.value) ||
  //       element.telephone_number.toLowerCase().includes(e.target.value) ||
  //       element.secondarycontact.toLowerCase().includes(e.target.value) ||
  //       element.address.toLowerCase().includes(e.target.value) ||
  //       element.jobexperience.toLowerCase().includes(e.target.value) ||
  //       element.salary.toString().includes(e.target.value) 

  //     )
  //     // const filter = data.filter(element =>
  //     //   Object.values(element).some(value =>
  //     //     value.toString().toLowerCase().includes(e.target.value.toLowerCase())
  //     //   )
  //     // );

  //     setRecords(filter)
  //   }

  return (
    <>
      <br></br>


      {/* <input type="text" placeholder='Search...' onChange={} className='form-control' /> */}
      <table className='table table-xs'>
        <thead>
          <tr>
            <th>ID</th>
            <th>JOB NO.</th>
            <th>ลูกค้าชื่อ</th>
            <th>ลายเซ็น</th>
            <th>วันที่</th>

          </tr>
        </thead>
        <tbody>
          {
            props.records.map((element, index) => (
              <tr key={index}>
                <td>{element.id}</td>
                <td>{element.job_id}</td>
                <td>{element.full_name}</td>
                <td>{element.receipt_status}</td>
                <td>{element.reception_date ? format(new Date(element.reception_date), "dd-MM-yyyy") : " "}</td>
                <td><button onClick={() => props.createpdf_QuotationId(element)} className="btn btn-outline btn-accent m-2">เลือกเอกสารใบนี้</button></td>
                {/* <td><button className="btn btn-error m-2" onClick={() => deleteWorkforceInformation(element.id) }>Delete </button></td> */}
              </tr>
            ))
          }
        </tbody>
      </table>
      {/* <button className="btn btn-success m-2" onClick={() => props.setDisplayComponent("Employee_Add")}>เพิ่ม</button>  */}
    </>
  );
}
