import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { format } from "date-fns";

export default function Reservation_search(props) {


  const deleteReservation = async (id) => {
    try {
      const response = await axios.delete(`${VITE_API_URL}/deleteReservation/${id}`);
      console.log('Data deleted successfully:', response.data);
      props.fetchAPI()
    } catch (error) {
      if (error.response) {
        console.error('Data not found or already deleted', error.response.data);
      } else if (error.request) {
        console.error('No response was received', error.request);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  const editReservation = async (element) => {
    props.setNewReservation({
      id: element.id,
      date: format(new Date(element.date), "yyyy-MM-dd"),
      fullname: element.fullname,
      E_mail: element.e_mail,
      tele_number: element.tele_number,
      response_details: element.response_details,
      reservation_type: element.reservation_type,
      details: element.details,
      status: element.status,
      WorkdayStatus: element.workdaystatus,
      update_record: element.update_record
    });
  };

  useEffect(() => {
    props.fetchAPI()
  }, [])

  //   const SearchData = (e) => {
  //     const filter = props.data.filter(element => 

  //       element.id.toString().includes(e.target.value) ||
  //       element.name_role.toLowerCase().includes(e.target.value) ||
  //       element.inventorystock.toString().includes(e.target.value) ||
  //       element.job.toString().includes(e.target.value) ||
  //       element.carandcustomer.toString().includes(e.target.value) ||
  //       element.quotations.toString().includes(e.target.value) ||
  //       element.requisitions.toString().includes(e.target.value) ||
  //       element.vehiclereceipts.toString().includes(e.target.value) ||
  //       element.repairappointments.toString().includes(e.target.value) ||
  //       element.Garages.toString().includes(e.target.value) 
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


      {/* <input type="text" placeholder='Search...' onChange={SearchData} className='form-control' /> */}
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>รหัส ID</th>
            <th>date</th>
            <th>fullname</th>
            <th>E_mail</th>
            <th>tele_number</th>

            <th>reservation_type</th>
            <th>details</th>
            <th>status</th>

            <th>response_details</th>
            <th>WorkdayStatus</th>
            <th>update_record</th>

          </tr>
        </thead>
        <tbody>
          {
            props.records.map((element, index) => (
              <tr key={index}>
                <td>{element.id}</td>
                <td>{format(new Date(element.date), "yyyy-MM-dd")}</td>
                <td>{element.fullname}</td>
                <td>{element.e_mail}</td>
                <td>{element.tele_number}</td>

                <td>{element.reservation_type}</td>
                <td>{element.details}</td>
                <td>{element.status}</td>
                <td><input type="checkbox" checked={element.workdaystatus} disabled /></td>
                <td>{element.response_details}</td>
                <td>{element.update_record}</td>
                {/* Your existing code for buttons can remain unchanged */}

                <td> <button className="btn  m-2" onClick={() => { editReservation(element); props.setDisplayComponent("Reservation_edit"); }} > แก้ไข </button> </td>
                <td><button onClick={() => { if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) { deleteReservation(element.id); } }} className="btn btn-error m-2">ลบข้อมูล </button></td>
                {/* <td><button onClick={() => { if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) { deleteReservation(element.id); } }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 w-24 rounded mr-2">ลบข้อมูล </button></td> */}
                
              </tr>
            ))
          }
        </tbody>

      </table>
      {/* <button className="btn btn-success m-2" onClick={() => props.setDisplayComponent("Reservation_add")}>เพิ่ม</button>  */}
      {/* <div><button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Reservation_search")}>กลับ</button> </div> */}
    </>
  );
}
