import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

export default function Create_garages() {

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
  let navigate = useNavigate();
  const fetchPermission = async () => {
    try {
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      const response๘work_roles_permissions = await axios.get(`${VITE_API_URL}/work_roles_permissions/${data_id.id}`);
      const additionalInfos = response๘work_roles_permissions.data;
      const all_role = []
      for (const additionalInfo of additionalInfos) {
        if (additionalInfo.role_id !== undefined) {
          const responseroles = await axios.get(`${VITE_API_URL}/fetchroles_permissionsById/${additionalInfo.role_id}`);
          const additionalInforoles = responseroles.data;
          all_role.push({
            ...additionalInforoles,
          });
        } else {
          console.error('role_id is undefined for item:', item);
        }
      }
      if (!all_role.some(permission => permission["garages"] === true)) {
        navigate('/garage');
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }
  useEffect(() => {
    fetchPermission()
  }, [])
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // const [garage, setGarage] = useState({});
  const [logoUrl, setLogoUrl] = useState('');
  const [logoImg, setLogoImg] = useState(null);
  const [garage, setGarage] = useState({
    garage_name: '',
    garageowner_id: null,
    tin: '',
    telephone_number: ' ',
    address: '',
    email: '',
    line_id: '',
    workinghours: '',
    detail_garages: '',
    update_record: ''
  });

  const fetchLogo = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/garages/${1}/logo`, { responseType: 'blob' });
      setLogoUrl(URL.createObjectURL(response.data));
      setLogoImg(response.data)
    } catch (error) {
      console.error('There was an error fetching the logo!', error);
    }
  };
  const fetchGarageDetails = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/garage/${1}`);
      setGarage(response.data);
    } catch {
      console.error('Error :', error);
    }
  };

  useEffect(() => {

    fetchLogo();
    fetchGarageDetails();
  }, []);

  const imageStyle = {
    width: '200px', // Adjust the width as needed
    height: '200px', // Adjust the height as needed
    objectFit: 'cover' // This ensures the aspect ratio is preserved and the image covers the set width/height without distortion
  };

  const handleInputChange = (e, setStateFunc) => {
    const { name, checked, type } = e.target;

    const value = type === 'checkbox' ? checked : e.target.value;

    setStateFunc(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setLogoImg(e.target.files[0]);
  };

  const updateGarageDetails = async () => {
    const data_id = JSON.parse(localStorage.getItem('data_id'));
    garage.update_record = data_id.full_name
    const formData = new FormData();
    Object.keys(garage).forEach(key => formData.append(key, garage[key]));
    if (logoImg != null) {
      formData.append('logo_img', logoImg)
    } else {
      formData.append('logo_img', logoImg)
    };

    try {
      // const response = await axios.put(`${VITE_API_URL}/garage/${1}`, garage);
      const response = await axios.put(`${VITE_API_URL}/garages/${1}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data)
      setLogoImg(null)

      // setLogoUrl(URL.createObjectURL(response.data));
      setGarage({
        garage_name: '',
        garageowner_id: null,
        tin: '',
        telephone_number: ' ',
        address: '',
        email: '',
        line_id: '',
        workinghours: '',
        detail_garages: '',
        update_record: ''
      });

      fetchLogo();
      fetchGarageDetails();

    } catch {
      console.error('Error :', error);
    }
  };

  //   function validateData(data) {
  //     let errors = {};

  //     // Check if national_id is 13 digits
  //     if (!(/^\d{13}$/.test(data.national_id))) {
  //       errors.national_id = "National ID must be a string of 13 digits";
  //   }
  //     if (!(/^\d{10}$/.test(data.telephone_number))) {
  //       errors.telephone_number = "telephone_number must be a string of 10 digits";
  //   }
  //     // Check if namePrefix is not empty
  //     else if (!data.namePrefix || data.namePrefix === '0') {
  //         errors.namePrefix = "Name prefix is required";
  //     }

  //     // Check if full_name is not empty
  //     else if (!data.full_name.trim()) {
  //         errors.full_name = "Full name is required";
  //     }

  //     // Check if age is not empty and is a number
  //     else if (!data.age || data.age <= 0) {
  //         errors.age = "Valid age is required";
  //     }

  //     // Check if email is not empty
  //     else if (!data.email || data.email === '0') {
  //         errors.email = "Email is required";
  //     }
  //     else{
  //       errors = "Pass";
  //     }

  //     return errors;
  // }


  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (validateData(NewOwnerData) == 'Pass'){
    //   await AddGaragesdata();

    // }
    await updateGarageDetails();


  };



  return (


    <>
      <br></br>
      <h1 className="text-3xl">สร้างอู่ซ่อมรถยนต์</h1>

      <div> {logoUrl ? <img src={logoUrl} style={imageStyle} alt="Garage Logo" /> : <p>No logo available</p>} </div>

      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ชื่ออู่ซ่อมรถยนต์</span> </div>
          <input type="varchar" name="garage_name" value={garage.garage_name} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <input type="file" onChange={handleFileChange} />

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">รหัสเจ้าของอู่ซ่อมรถยนต์</span> </div>
          <input type="integer" name="garageowner_id" value={garage.garageowner_id} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">หมายเลขภาษี</span> </div>
          <input type="varchar" name="tin" value={garage.tin} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ประเภทอู่ซ่อมรถยนต์</span> </div>
          <select type="varchar" name="detail_garages" value={garage.detail_garages} onChange={(e) => handleInputChange(e, setGarage)} className="select select-bordered w-full max-w-xs">
            <option>เลือก</option>
            <option>อู่ซ่อมทั่วไป</option>
            <option>อู่ซ่อมเฉพาะทาง</option>
            <option>อู่ซ่อมรถตัวถังและสี</option>
            <option>อู่ซ่อมรถพิเศษ</option>
            <option>อู่ซ่อมรถยนต์ไฮบริดและไฟฟ้า</option>
            <option>อู่ซ่อมรถด่วนหรือบริการทางถนน</option>
          </select> <div className="label">
          </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">เวลาทำงาน</span> </div>
          <input type="varchar" name="workinghours" value={garage.workinghours} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ที่อยู่ของอู่</span> </div>
          <input type="varchar" name="address" value={garage.address} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">เบอร์โทรติดต่ออู่ซ่อม</span> </div>
          <input type="varchar" name="telephone_number" value={garage.telephone_number} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">อีเมลติดต่ออู่ซ่อม</span> </div>
          <input type="varchar" name="email" value={garage.email} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">line ID</span> </div>
          <input type="varchar" name="line_id" value={garage.line_id} onChange={(e) => handleInputChange(e, setGarage)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label"> </div>
        </label>

        <button onClick={handleSubmit} className="btn btn-success m-2">บันทึก</button>
        <button className="btn btn-error m-2">ยกเลิก</button>
        <br></br>
      </form>

    </>
  );
}



