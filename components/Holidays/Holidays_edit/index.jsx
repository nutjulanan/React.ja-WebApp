import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

import { format } from "date-fns";


export default function Holidays_edit(props) {  
  

  const UpdateHolidays = async () => {
    try {
      console.log(props.NewHolidays)
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      props.NewHolidays.update_record = data_id.full_name
      
      const NewHolidays_response = await axios.put(`${VITE_API_URL}/UpdateHolidays/${props.NewHolidays.id}`, props.NewHolidays);
      console.log('Data updated successfully:', NewHolidays_response.data);

      
      props.setNewHolidays({
        id : null,
        date : null,
        nameholidays: "",
        workdaystatus: false,   
        update_record: false
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
    await UpdateHolidays();
    // if (validateData(NewWorkforceInformation) == 'Pass'){
    //   
    //   // await GetIDOwner(NewWorkforceInformation.email);
    // await Addaccountdata();
    //   await AddWeeklydata();
    //   await Addgaragesdata();
    
    props.setDisplayComponent("Holidays_search")
    await props.fetchAPI()
    // }
    
  };

    return (
        <>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">วันที่</span> </div>
        <input type="date" name="date" value={format(new Date(props.NewHolidays.date), "yyyy-MM-dd")} onChange={(e) => handleInputChange(e, props.setNewHolidays)}placeholder="วันที่" />
        </label>

        <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">ชื่อวันหยุด</span> </div>
        <input type="varchar"  name="nameholidays"  value={props.NewHolidays.nameholidays} onChange={(e) => handleInputChange(e, props.setNewHolidays)} placeholder="ชื่อวันหยุด" className="input input-bordered w-full max-w-xs"/>
        </label>

        <label className="label">
        <input type="checkbox" name="workdaystatus" checked={props.NewHolidays.workdaystatus} onChange={(e) => handleInputChange(e, props.setNewHolidays)} className="checkbox checkbox-bordered" /> <span className="label-text" placeholder="สถานะ">สถานะ</span>
        </label>

        <div className="flex items-center justify-center space-x-2"> 
        <button type="submit" className="btn btn-success m-2">บันทึก</button>
        <button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Holidays_search")}>ยกเลิก</button> 
        </div>

        <br></br></form>
        </>
    );
  }
  