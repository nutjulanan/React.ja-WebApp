import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

import { format } from "date-fns";


export default function Reservation_edit(props) {  
  

  const UpdateReservation = async () => {
    try {
      console.log(props.NewReservation)
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      props.NewReservation.update_record = data_id.full_name
      
      const NewReservation_response = await axios.put(`${VITE_API_URL}/UpdateReservation/${props.NewReservation.id}`, props.NewReservation);
      console.log('Data updated successfully:', NewReservation_response.data);

      
      props.setNewReservation({
        id : null,
        fullname: null,
        E_mail: null,   
        tele_number: null,   
        date: null,   
        WorkdayStatus : null,
        response_details: null,   
        reservation_type: null,   
        details: null,   
        status: null,  
        update_record: null
      });

    } catch (error) {
      console.error('Error adding data:', error);
    }
  };





  const handleInputChange = (e, setStateFunc) => {
    const { name, checked, type } = e.target;
    const value = type === 'checkbox' ? checked : e.target.value;
    setStateFunc(prevData => ({
        ...prevData,
        [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await UpdateReservation();
    // if (validateData(NewWorkforceInformation) == 'Pass'){
    //   
    //   // await GetIDOwner(NewWorkforceInformation.email);
    // await Addaccountdata();
    //   await AddWeeklydata();
    //   await Addgaragesdata();
    
    props.setDisplayComponent("Reservation_search")
    await props.fetchAPI()
    // }
    
  };

    return (
        <>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        

        <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">status</span> </div>
        <select type="varchar"  name="status"  value={props.NewReservation.status} onChange={(e) => handleInputChange(e, props.setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs">
          <option value="">เลือก</option>
          <option value="การจองสำเร็จ">การจองสำเร็จ</option>
          <option value="การจองไม่สำเร็จ">การจองไม่สำเร็จ</option>
          <option value="ไม่สามารถจองได้">ไม่สามารถจองได้</option>
       
        </select>
        </label>
{/* 
              <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">ประเภทบริการ</span> </div>
        <select type="varchar"  name="reservation_type"  value={NewReservation.reservation_type} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs">
          <option value=""></option>
          <option value="auto">ทำสี</option>
          <option value="nomal_gear">ถ่ายน้ำมันเครื่อง</option>
          <option value="CVT">เติมลม</option>
          <option value="DCTs">เครือบแก้ว</option> 
        </select>
        </label> */}


        <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">response_details</span> </div>
        <input type="varchar"  name="response_details"  value={props.NewReservation.response_details} onChange={(e) => handleInputChange(e, props.setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs"/>
        </label>

        <label className="label">
        <input type="checkbox" name="WorkdayStatus" checked={props.NewReservation.WorkdayStatus} onChange={(e) => handleInputChange(e, props.setNewReservation)} className="checkbox checkbox-bordered" /> <span className="label-text">WorkdayStatus</span>
        </label>

        <div className="flex items-center justify-center space-x-2"> 
        <button type="submit" className="btn btn-success m-2">บันทึก</button>
        <button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Reservation_search")}>ยกเลิก</button> 
        </div>

        <br></br></form>
        </>
    );
  }
  