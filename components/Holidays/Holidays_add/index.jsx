import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Holidays_add(props) {  
    

    const [NewHolidays, setNewHolidays] = useState({
        date : null,
        nameholidays: "",
        workdaystatus: null,   
        update_record: null
      });

  const AddHolidays = async () => {
    try {
      // console.log(NewHolidays)
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      NewHolidays.update_record = data_id.full_name
      const response = await axios.post(`${VITE_API_URL}/AddHolidaysdata`, NewHolidays, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = response.data;

      console.log('Inserted data:', result);
      setNewHolidays({
        date : null,
        nameholidays: "",
        workdaystatus: true,   
        update_record: null
      
      });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };


  const handleInputChange = (e, setStateFunc) => {
    // console.log(setStateFunc)
    const { name, checked, type } = e.target;
    const value = type === 'checkbox' ? checked : e.target.value;
    setStateFunc(prevData => ({
        ...prevData,
        [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AddHolidays();
    // await Addaccountdata();
    // await props.fetchAPI()
    props.setDisplayComponent("Holidays_search")
    // }
    
  };

    return (
        <>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">วัน</span> </div>
        <input type="date" name="date" value={NewHolidays.date} onChange={(e) => handleInputChange(e, setNewHolidays)} />
        </label>

        <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">ชื่อวันหยุด</span> </div>
        <input type="varchar"  name="nameholidays"  value={NewHolidays.nameholidays} onChange={(e) => handleInputChange(e, setNewHolidays)} placeholder="" className="input input-bordered w-full max-w-xs"/>
        </label>

        <label className="label">
        <input type="checkbox" name="workdaystatus" checked={NewHolidays.workdaystatus} onChange={(e) => handleInputChange(e, setNewHolidays)} className="checkbox checkbox-bordered" /> <span className="label-text">สถานะ</span>
        </label>
        
        <div className="flex items-center justify-center space-x-2">
        <button type="submit" className="btn btn-success m-2">บันทึก</button>
        <div><button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Holidays_search")}>ยกเลิก</button> </div>
           </div>
        <br></br></form>

        </>
    );
  }
  
