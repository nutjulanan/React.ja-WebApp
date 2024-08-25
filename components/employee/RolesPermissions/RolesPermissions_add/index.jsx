import axios from 'axios';
import React, { useEffect, useState } from 'react';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function RolesPermissions_add(props) {  
    

  const [NewRolesPermissions, setNewRolesPermissions] = useState({
    id : null,
    name_role: "",
    inventorystock: false,   
    job: false,
    carandcustomer: false,
    quotations: false,
    requisitions: false,
    vehiclereceipts: false,
    repairappointments: false,
    garages: false,
    update_record : null
      
  });

  

  const Addroles_permissions = async () => {
    try {
      // console.log(NewRolesPermissions)
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      NewRolesPermissions.update_record = data_id.full_name
      const response = await axios.post(`${VITE_API_URL}/Addroles_permissions`, NewRolesPermissions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = response.data;


      console.log('Inserted data:', result);
      setNewRolesPermissions({
        id : null,
        name_role: "",
        inventorystock: false,   
        job: false,
        carandcustomer: false,
        quotations: false,
        requisitions: false,
        vehiclereceipts: false,
        repairappointments: false,
        garages: false,
        update_record : null
      
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
    await Addroles_permissions();
    // await Addaccountdata();
    // await props.fetchAPI()
    props.setDisplayComponent("RolesPermissions_search")
    // }
    
  };

    return (
      <div className="max-w-lg mx-auto p-5 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col items-start space-y-4">
        <label className="form-control w-full max-w-xs">
          <span className="label">ชื่อตำแหน่ง</span>
          <input
            type="varchar"
            name="name_role"
            value={NewRolesPermissions.name_role}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            placeholder=""
            className="input input-bordered"
          />
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="inventorystock"
            checked={NewRolesPermissions.inventorystock}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">คลังอุปกรณ์และอะไหล่</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="job"
            checked={NewRolesPermissions.job}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">job</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="carandcustomer"
            checked={NewRolesPermissions.carandcustomer}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">carandcustomer</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="quotations"
            checked={NewRolesPermissions.quotations}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">quotations</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="requisitions"
            checked={NewRolesPermissions.requisitions}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">requisitions</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="vehiclereceipts"
            checked={NewRolesPermissions.vehiclereceipts}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">vehiclereceipts</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="repairappointments"
            checked={NewRolesPermissions.repairappointments}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">repairappointments</span>
        </label>
    
        <label className="label flex items-center space-x-2">
          <input
            type="checkbox"
            name="garages"
            checked={NewRolesPermissions.garages}
            onChange={(e) => handleInputChange(e, setNewRolesPermissions)}
            className="checkbox checkbox-bordered"
          />
          <span className="label-text">garages</span>
        </label>
        
        <div className="flex items-center justify-center space-x-2"> 
        <button type="submit" className="btn btn-primary ">บันทึก</button>
        <button className="btn" onClick={() => props.setDisplayComponent("RolesPermissions_search")}>ยกเลิก</button>
        </div>
      </form>
    </div>

    );
  }
  
