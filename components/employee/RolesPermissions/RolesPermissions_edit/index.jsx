import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function RolesPermissions_edit(props) {


  const UpdateRolesPermissions = async () => {
    try {
      console.log(props.NewRolesPermissions)
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      props.NewRolesPermissions.update_record = data_id.full_name

      const NewRolesPermissions_response = await axios.put(`${VITE_API_URL}/updatroles_permissions/${props.NewRolesPermissions.id}`, props.NewRolesPermissions);
      console.log('Data updated successfully:', NewRolesPermissions_response.data);


      props.setNewRolesPermissions({
        id: null,
        name_role: "",
        inventorystock: false,
        job: false,
        carandcustomer: false,
        quotations: false,
        requisitions: false,
        vehiclereceipts: false,
        repairappointments: false,
        garages: false,
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
    await UpdateRolesPermissions();
    await props.fetchAPI()
    props.setDisplayComponent("RolesPermissions_search")
    // }

  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col items-start space-y-4">
        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ชื่อตำแหน่ง</span> </div>
          <input type="varchar" name="name_role" value={props.NewRolesPermissions.name_role} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="inventorystock" checked={props.NewRolesPermissions.inventorystock} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">คลังอุปกรณ์และอะไหล่</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="job" checked={props.NewRolesPermissions.job} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">job</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="carandcustomer" checked={props.NewRolesPermissions.carandcustomer} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">carandcustomer</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="quotations" checked={props.NewRolesPermissions.quotations} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">quotations</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="requisitions" checked={props.NewRolesPermissions.requisitions} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">requisitions</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="vehiclereceipts" checked={props.NewRolesPermissions.vehiclereceipts} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">vehiclereceipts</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="repairappointments" checked={props.NewRolesPermissions.repairappointments} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">repairappointments</span>
        </label>

        <label className="label flex items-center space-x-2">
          <input type="checkbox" name="garages" checked={props.NewRolesPermissions.garages} onChange={(e) => handleInputChange(e, props.setNewRolesPermissions)} className="checkbox checkbox-bordered" /> <span className="label-text">garages</span>
        </label>


        <div className="flex items-center justify-center space-x-2"> 
        <button type="submit" className="btn btn-primary m-2">บันทึก</button>
        <button className="btn m-2" onClick={() => props.setDisplayComponent("RolesPermissions_search")}>ยกเลิก</button>
        </div>

        <br></br></form>
    </div>
  );
}
