import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;


export default function Employee_Add(props) {
  const [NewWorkforceInformation, setNewWorkforceInformation] = useState({
    national_id: null,
    nameprefix: null,
    full_name: null,
    age: null,
    sex: null,
    email: "-",
    telephone_number: "-",
    secondarycontact: "-",
    address: "-",
    jobexperience: "-",
    salary: null,
    totalvacationdays: 0,
    start_work_date: null,
    end_of_work_day: null,
    update_record: null
  });

  const [NewAccount, setNewAccount] = useState({
    Data_id: null,
    username: null,
    password: null,
    password_hash: null,
    update_record: null
  });



  const AddWorkforceInformation = async () => {
    try {
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      NewWorkforceInformation.update_record = data_id.full_name
      const response = await axios.post(`${VITE_API_URL}/AddWorkforceInformation`, NewWorkforceInformation, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = response.data;

      NewAccount.Data_id = result.id;
      console.log('Inserted data:', result);

      // Roleset.Workforce_id = result.id
      // console.log('data:', Roleset);
      setNewWorkforceInformation({
        national_id: null,
        nameprefix: null,
        full_name: null,
        age: null,
        sex: null,
        email: null,
        telephone_number: null,
        secondarycontact: null,
        address: null,
        jobexperience: null,
        salary: null,
        totalvacationdays: 0,
        start_work_date: null,
        end_of_work_day: null,
        update_record: null
      });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

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
            update_record: data_id.full_name, Workforce_id: NewAccount.Data_id,
          };
          console.log(dataToSend)
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
  const Addaccountdata = async () => {
    try {
      const data_id = JSON.parse(localStorage.getItem('data_id'));
      NewAccount.update_record = data_id.full_name
      console.log('xxxxxxxxxx data:', NewAccount);

      const response = await axios.post(`${VITE_API_URL}/AddAccountdata`, NewAccount, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Inserted data:', response.data);

      setNewAccount({
        Data_id: null,
        username: '0',
        password: '0',
        password_hash: '0',
        update_record: null
      });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };




  const fetchAPI = async () => {
    const res = await axios.get(`${VITE_API_URL}/roles_permissions`)
    setData_roles_permissions(res.data)
  }

  useEffect(() => {
    fetchAPI()
  }, []);


  const handleInputChange = (e, setStateFunc) => {
    const { name, value, type } = e.target;
    // Check if the input is 'role_id' and convert its value to an integer.
    // For other inputs, handle them as before.
    let newValue = value;
    if (name === 'role_id') {
      newValue = value === '' ? '' : parseInt(value, 10);
      // Check for NaN and set to a default value or handle it as needed
      if (isNaN(newValue)) {
        newValue = ''; // or any other default value you deem appropriate
      }
    } else if (type === 'checkbox') {
      newValue = e.target.checked;
    }

    setStateFunc(prevData => ({
      ...prevData,
      [name]: newValue
    }));
  };

  const fetchAccount = async (userId) => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAccountDataByUsername/${userId}`);
      console.log(response)
      if (response.data == 'Account not found') {
        return true;
      }
      return response.data ? false : true; // Assuming false means user exists, true means user does not exist
    } catch (err) {
      return true;
    }
  };

  async function validateData(NewWorkforceInformation, NewAccount) {
    const accountDoesNotExist = await fetchAccount(NewAccount.username);
    console.log(accountDoesNotExist)
    if (!NewAccount.password_hash || NewAccount.password_hash != NewAccount.password || !NewAccount.password) {
      return alert("รหัสผ่านผิดพลาด");

    } else if (!NewAccount.username) {
      return alert("โปรดระบุชื่อผู้ใช้งาน");
    } else if (!accountDoesNotExist) {
      return alert("ชื่อผู้ใช้งานใช้ไปแล้ว");
    } else if (!NewWorkforceInformation.national_id) {
      return alert("โปรดระบุเลขบัตรประชาชน");
    } else if (!NewWorkforceInformation.nameprefix) {
      return alert("โปรดระบุคำนำหน้าชื่อ");
    } else if (!NewWorkforceInformation.full_name) {
      return alert("โปรดระบุชื่อ");
    } else {
      return true;
    }


  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await validateData(NewWorkforceInformation, NewAccount) == true) {
      await AddWorkforceInformation();
      await Addwork_roles_permissions();
      await Addaccountdata();
      await props.fetchAPI()
      props.setDisplayComponent("Employee_search")
    }

  };

  return (
    <div className="container mx-auto p-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4"  >
      <div className="col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">เลขบัตรประชาชน</span> </div>
          <input type="varchar" name="national_id" value={NewWorkforceInformation.national_id} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" required />
        </label>
      </div>
      <div className="col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">คำนำหน้าชื่อ</span> </div>
          <select name="nameprefix" value={NewWorkforceInformation.nameprefix} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} className="select select-bordered">
            <option>เลือก</option>
            <option>นาย</option>
            <option>นาง</option>
            <option>นางสาว </option>
          </select>
        </label>
      </div>
      <div className="col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">ชื่อ-นามสกุล</span> </div>
          <input type="varchar" name="full_name" value={NewWorkforceInformation.full_name} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">อายุ</span> </div>
          <input type="integer" name="age" value={NewWorkforceInformation.age} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">เพศ</span> </div>
          <select name="sex" value={NewWorkforceInformation.sex} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} className="select select-bordered">
            <option>เลือก</option>
            <option>ชาย</option>
            <option>หญิง</option>
          </select>
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">อีเมล</span> </div>
          <input type="varchar" name="email" value={NewWorkforceInformation.email} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">เบอร์โทร</span> </div>
          <input type="varchar" name="telephone_number" value={NewWorkforceInformation.telephone_number} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">เบอร์โทรสำรอง</span> </div>
          <input type="varchar" name="secondarycontact" value={NewWorkforceInformation.secondarycontact} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">ที่อยู่</span> </div>
          <input type="varchar" name="address" value={NewWorkforceInformation.address} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">ประสบการณ์</span> </div>
          <input type="varchar" name="jobexperience" value={NewWorkforceInformation.jobexperience} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">ค่าจ้าง</span> </div>
          <input type="varchar" name="salary" value={NewWorkforceInformation.salary} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} placeholder="" className="input input-bordered" />
        </label>
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="form-control">
          <div className="label"> <span className="label-text">วันที่เริ่มทำงาน</span> </div>
          <input type="date" name="start_work_date" value={NewWorkforceInformation.start_work_date} onChange={(e) => handleInputChange(e, setNewWorkforceInformation)} />
        </label>
      </div>

    </form>
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl col-span-3">สร้างบัญชี</h1>
        <div className="col-span-3">
          <label className="form-control">
            <div className="label"> <span className="label-text">ชื่อผู้ใช้</span>  </div>
            <input type="varchar" name="username" value={NewAccount.username} onChange={(e) => handleInputChange(e, setNewAccount)} placeholder="" className="input input-bordered" required />
          </label>
        </div>
        <div className="col-span-3">
          <label className="form-control">
            <div className="label"> <span className="label-text">รหัสผ่าน</span> </div>
            <input type="varchar" name="password" value={NewAccount.password} onChange={(e) => handleInputChange(e, setNewAccount)} placeholder="" className="input input-bordered" required />
          </label>
        </div>
        <div className="col-span-3">
          <label className="form-control">
            <div className="label"> <span className="label-text">รหัสผ่าน(อีกครั้ง)</span> </div>
            <input type="varchar" name="password_hash" value={NewAccount.password_hash} onChange={(e) => handleInputChange(e, setNewAccount)} placeholder="" className="input input-bordered" required />
            <div className="label">
            </div>
          </label>
        </div>
        <div className="col-span-3">
          <button type='button' className="btn btn-success m-2" onClick={() => handleClick()}>เพิ่มหน้าที่</button>
          <div>{renderselect()}</div>
        </div>
        <div className="col-span-3">
          <button onClick={handleSubmit} className="btn btn-primary m-2" >บันทึก</button>
          <button className="btn  m-2" onClick={() => props.setDisplayComponent("Employee_search")}>ยกเลิก</button>
        </div>
        </div>
      </div>
  </div>
  

  );
}

