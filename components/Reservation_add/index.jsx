import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Reservation_add({ selectedService }) {


  const [NewReservation, setNewReservation] = useState({
    fullname: "",
    E_mail: "",
    tele_number: "",
    date: "",
    WorkdayStatus: false,
    response_details: "",
    reservation_type: "",
    details: "",
    status: "ยังไม่ยืนยัน ",
    update_record: ""
  });


  const AddReservation = async () => {
    console.log(NewReservation.fullname);
    try {
      // console.log(NewReservation)
      // const data_id = JSON.parse(localStorage.getItem('data_id'));
      // NewReservation.update_record = data_id.full_name
      const response = await axios.post(`${VITE_API_URL}/AddReservationdata`, NewReservation, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data;
      console.log('Inserted data:', result);
      alert("การจองสำเร็จ ท่านสามารถตรวจสอบการจองได้โดยใส่เบอร์โทรศัพท์หรืออีเมลของท่าน");
      setNewReservation({
        fullname: "",
        E_mail: "",
        tele_number: "",
        date: "",
        WorkdayStatus: false,
        response_details: "",
        reservation_type: "",
        details: "",
        status: "ยังไม่ยืนยัน ",
        update_record: ""
      });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  useEffect(() => {
    setNewReservation(prev => ({ ...prev, reservation_type: selectedService }));
  }, [selectedService]);

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
    await AddReservation();

  };

  return (
    <div id="main1Section">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">วันที่</span> </div>
          <input type="date" name="date" value={NewReservation.date} onChange={(e) => handleInputChange(e, setNewReservation)} className="input input-bordered w-full" />
        </label>

        {/* <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">national_id</span> </div>
        <input type="varchar"  name="national_id"  value={NewReservation.national_id} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs"/>
        </label> */}

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ชื่อ-สกุล</span> </div>
          <input type="varchar" name="fullname" value={NewReservation.fullname} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">อีเมลล์</span> </div>
          <input type="varchar" name="E_mail" value={NewReservation.E_mail} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">เบอร์โทร</span> </div>
          <input type="varchar" name="tele_number" value={NewReservation.tele_number} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs" />

        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ประเภทบริการ</span> </div>
          <input type="text" name="reservation_type" value={NewReservation.reservation_type} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="กรอกประเภทบริการ" className="input input-bordered w-full max-w-xs" />
        </label>

        {/* <label className="form-control w-full max-w-xs">
        <div className="label"> <span className="label-text">ประเภทบริการ</span> </div>
        <select type="varchar"  name="reservation_type"  value={NewReservation.reservation_type} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs">
          <option value="">เลือกเซอร์วิส</option>
          <option value="auto">ทำสี</option>
          <option value="nomal_gear">ถ่ายน้ำมันเครื่อง</option>
          <option value="CVT">เติมลม</option>
          <option value="DCTs">เครือบแก้ว</option> 
        </select>
        </label> */}

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">รายละเอียด</span> </div>
          <input type="varchar" name="details" value={NewReservation.details} onChange={(e) => handleInputChange(e, setNewReservation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        {/* <label className="label">
        <input type="checkbox" name="workdaystatus" checked={NewReservation.workdaystatus} onChange={(e) => handleInputChange(e, setNewReservation)} className="checkbox checkbox-bordered" /> <span className="label-text">workdaystatus</span>
        </label> */}

        <button type="submit" className="btn2 btn-active btn-primary px-11 py-3 text-lg rounded-lg shadow-lg mt-6">จอง</button>
        {/* <div><button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Reservation_search")}>ยกเลิก</button> </div> */}
        <br></br></form>

    </div>
  );
}

