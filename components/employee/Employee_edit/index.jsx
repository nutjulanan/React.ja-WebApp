import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

import { format } from "date-fns";

export default function Employee_edit(props) {

  const [NewAccount, setNewAccount] = useState({
    user_id: null,
    data_id: null,
    username: '',
    password: '',
    password_hash: '',
    update_record: null
  });

  let [work_roles_permissions, setwork_roles_permissions] = useState([]);
  // console.log(work_roles_permissions)




  const fetchAPIrole = async () => {
    const res = await axios.get(`${VITE_API_URL}/work_roles_permissions/${props.NewWorkforceInformation.id}`);

    const resluts = res.data;//res.data;
    let updatedData = [];

    for (const reslut of resluts) { // Loop ผ่านทุกๆ reslut
      // ตรวจสอบ role_id ที่ได้รับจาก response

      // ตรวจสอบก่อนว่า reslut.role_id ไม่ใช่ undefined
      if (reslut.role_id !== undefined) {
        const responseroles = await axios.get(`${VITE_API_URL}/fetchroles_permissionsById/${reslut.role_id}`);
        const reslutroles = responseroles.data;
        // role_text +=  + " ";
        updatedData.push({
          ...reslut,
          info: reslutroles.name_role // เพิ่มข้อมูลใหม่ที่คุณต้องการ
        });

      } else {
        // ทำอย่างอื่นถ้า role_id ไม่ได้ถูกกำหนด
        console.error('role_id is undefined for item:', item);
      }
    }


    setwork_roles_permissions(updatedData);
  }

  useEffect(() => {
    const fetchAccountData = async () => {
      fetchAPI()
      fetchAPIrole()
      try {
        // Replace 'http://your-api-url.com' with the actual base URL of your API
        const response = await axios.get(`${VITE_API_URL}/fetchAccountDataById/${props.NewWorkforceInformation.id}`);
        const fetchedData = { ...response.data, password: response.data.password_hash };
        setNewAccount(fetchedData);





      } catch (err) {
        console.error('Error fetching account data:', err);
      }
    };

    if (props.NewWorkforceInformation.id) {
      fetchAccountData();
    }
  }, []);

  const DeleteWorkRolePermission = async (element) => {
    try {
      const response = await fetch(`${VITE_API_URL}/deleteWorkRolePermission/${element.role_id}/${element.workforce_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAPIrole()
        alert('Record deleted successfully');

        // Reset the form or perform other actions after successful deletion
      } else {
        alert('Failed to delete the record. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting the record:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const fetchAPI = async () => {
    const res = await axios.get(`${VITE_API_URL}/roles_permissions`)
    setData_roles_permissions(res.data)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [selectCount, setSelectCount] = useState(0);
  const [sectors, setSectors] = useState([]);

  const handleClick = () => {
    setSelectCount(prevCount => prevCount + 1);
    setSectors(prevSectors => [
      ...prevSectors,
      { role_id: null, Workforce_id: null, update_record: null },
    ]);
  };


  const [Data_roles_permissions, setData_roles_permissions] = useState([]);

  const Addwork_roles_permissions = async () => {
    try {
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      const responses = await Promise.all(
        sectors.map(async (sector) => {
          const dataToSend = {
            ...sector,
            update_record: data_id.full_name, Workforce_id: NewAccount.data_id,
          };

          // console.log("test",NewAccount.Data_id)
          return await axios.post(`${VITE_API_URL}/Addwork_roles_permissions`, dataToSend, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        })
      );
      console.log('Inserted data:', responses.map(res => res.data));
      // Reset sectors after submission
      setSectors([]);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const renderselect = () =>
    sectors.map((sector, index) => (
      <select
        key={index}
        name="role_id"
        value={sector.role_id || ''}
        onChange={(e) => handleInputChangeselect(e, index)}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="">เลือก</option>
        {Data_roles_permissions.map((element, idx) => (
          <option key={idx} value={element.id}>
            {element.name_role}
          </option>
        ))}
      </select>
    ));

  const handleInputChangeselect = (e, index) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'role_id') {
      newValue = value === '' ? null : parseInt(value, 10);
      if (isNaN(newValue)) newValue = null;
    }
    setSectors(prevSectors =>
      prevSectors.map((sector, idx) =>
        idx === index ? { ...sector, [name]: newValue } : sector
      )
    );
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const UpdateWorkforceInformationdata = async () => {
    try {
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      props.NewWorkforceInformation.update_record = data_id.full_name

      const NewWorkforceInformation_response = await axios.put(`${VITE_API_URL}/UpdateWorkforceInformationdata/${props.NewWorkforceInformation.id}`, props.NewWorkforceInformation);
      console.log('Data updated successfully:', NewWorkforceInformation_response.data);

      NewAccount.update_record = data_id.full_name
      NewAccount.data_id = NewWorkforceInformation_response.data.id
      const NewAccount_response = await axios.put(`${VITE_API_URL}/UpdateAccountData/${NewAccount.user_id}`, NewAccount);
      console.log('Data updated successfully:', NewAccount_response.data);

      props.setNewWorkforceInformation({
        id: "",
        national_id: "",
        nameprefix: "",
        full_name: "",
        age: 0,
        sex: "",
        email: "",
        telephone_number: "",
        secondarycontact: "",
        address: "",
        jobexperience: "",
        salary: 0,
        totalvacationdays: 0,
        start_work_date: "1-1-1",
        end_of_work_day: "1-1-1",
        update_record: null
      });

      setNewAccount({
        user_id: null,
        data_id: null,
        username: '',
        password: '',
        password_hash: ''
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


  async function validateData() {
    if (!NewAccount.password_hash || NewAccount.password_hash != NewAccount.password || !NewAccount.password) {
      return alert("รหัสผ่านผิดพลาด");
    } else if (!props.NewWorkforceInformation.national_id) {
      return alert("โปรดระบุเลขบัตรประชาชน");
    } else if (!props.NewWorkforceInformation.nameprefix) {
      return alert("โปรดระบุคำนำหน้าชื่อ");
    } else if (!props.NewWorkforceInformation.full_name) {
      return alert("โปรดระบุชื่อ");
    } else {
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await validateData() == true) {
      await UpdateWorkforceInformationdata();
      await Addwork_roles_permissions();
      await props.fetchAPI()
      props.setDisplayComponent("Employee_search")
    }

  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">{props.NewWorkforceInformation.id}</span> </div>
          <div className="label"> <span className="label-text">เลขบัตรประชาชน</span> </div>
          <input type="varchar" name="national_id" value={props.NewWorkforceInformation.national_id} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">คำนำหน้าชื่อ</span> </div>
          <select type="varchar" name="nameprefix" value={props.NewWorkforceInformation.nameprefix} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)}
            className="select select-bordered w-full max-w-xs">

            <option>เลือก</option>
            <option>นาย</option>
            <option>นาง</option>
            <option>นางสาว</option>
          </select>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">เพศ</span> </div>
          <select type="varchar" name="sex" value={props.NewWorkforceInformation.sex} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)}
            className="select select-bordered w-full max-w-xs">

            <option>เลือก</option>
            <option>ชาย</option>
            <option>หญิง</option>
          </select>
        </label>


        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ชื่อ-นามสกุล</span> </div>
          <input type="varchar" name="full_name" value={props.NewWorkforceInformation.full_name} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">อายุ</span> </div>
          <input type="integer" name="age" value={props.NewWorkforceInformation.age} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">อีเมล</span> </div>
          <input type="varchar" name="email" value={props.NewWorkforceInformation.email} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">เบอร์โทร</span> </div>
          <input type="varchar" name="telephone_number" value={props.NewWorkforceInformation.telephone_number} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">เบอร์โทรสำรอง</span> </div>
          <input type="varchar" name="secondarycontact" value={props.NewWorkforceInformation.secondarycontact} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ที่อยู่</span> </div>
          <input type="varchar" name="address" value={props.NewWorkforceInformation.address} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ประสบการณ์</span> </div>
          <input type="varchar" name="jobexperience" value={props.NewWorkforceInformation.jobexperience} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ค่าจ้าง</span> </div>
          <input type="varchar" name="salary" value={props.NewWorkforceInformation.salary} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">วันที่เริ่มทำงาน</span> </div>
          <input type="date" name="start_work_date" value={format(new Date(props.NewWorkforceInformation.start_work_date), "yyyy-MM-dd")} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">วันที่เลิกทำงาน</span> </div>
          <input type="date" name="end_of_work_day" value={format(new Date(props.NewWorkforceInformation.end_of_work_day), "yyyy-MM-dd")} onChange={(e) => handleInputChange(e, props.setNewWorkforceInformation)} />
        </label>


        <h1 className="text-3xl">บัญชี</h1>

        <div className="label"> <span className="label-text">หมายเลขบัญชี : {NewAccount.user_id}</span> </div>
        <div className="label"> <span className="label-text">ชื่อบัญชีผู้ใช้ : {NewAccount.username}</span> </div>
        {/* <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">ชื่อผู้ใช้</span>  </div>
          <input type="varchar" name="username" value={NewAccount.username} onChange={(e) => handleInputChange(e, setNewAccount)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label> */}

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">รหัสผ่าน</span> </div>
          <input type="varchar" name="password" value={NewAccount.password} onChange={(e) => handleInputChange(e, setNewAccount)} placeholder="" className="input input-bordered w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"> <span className="label-text">รหัสผ่าน(อีกครั้ง)</span> </div>
          <input type="varchar" name="password_hash" value={NewAccount.password_hash} onChange={(e) => handleInputChange(e, setNewAccount)} placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>


        <button type='button' className="btn btn-success m-2" onClick={() => handleClick()}>เพิ่มตำแหน่ง</button>
        <div>{renderselect()}</div>
        {
          work_roles_permissions.map((element, index) => (
            <tr key={index}>
              {/* <td>{element.role_id}</td> */}
              <td>{element.info}</td>
              <td><button type='button' className="btn btn-sm btn-error m-2" onClick={() => DeleteWorkRolePermission(element)}>ลบ</button></td>
            </tr>
          ))
        }
         <div className="flex items-center justify-center space-x-2"> 

        <button type="submit" className="btn btn-success m-2">บันทึก</button>
        <button className="btn m-2" onClick={() => props.setDisplayComponent("Employee_search")}>ยกเลิก</button>
        <br></br>
        </div>
        </form>
    </>
  );
}
