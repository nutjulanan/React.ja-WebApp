import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin }) {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await GetaccountData(accountData.username, accountData.password_hash);

  };

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const [accountData, setaccountData] = useState({
    username: 'admin',
    password_hash: 'admin'

  });

  const GetaccountData = async (username, password_hash) => {
    try {
      const response = await fetch(`${VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password_hash }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // จัดเก็บ JWT ที่ได้รับไว้ใน localStorage
      localStorage.setItem('jwtToken', result.token);



      try {
        const responseWorkforce = await fetch(`${VITE_API_URL}/fetchWorkforceInformationById/${result.user.data_id}`, {
          method: 'GET',
        });
        const resultWorkforce = await responseWorkforce.json();

        if (!responseWorkforce.ok) {
          throw new Error(`HTTP error! status: ${responseWorkforce.status}`);
        }

        // console.log(resultWorkforce)
        localStorage.setItem('data_id', JSON.stringify(resultWorkforce));
        const data_id = JSON.parse(localStorage.getItem('data_id'));
        // console.log('Pass', data_id.id);
        console.log(data_id.id);
        navigate('/garage');

        // onLogin(); // Ensure this function is defined elsewhere
      } catch (error) {
        console.error('Error fetching data by id:', error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div id="loginSection" className="hero min-h-screen bg-base-200 flex items-center justify-center">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">เข้าสู่ระบบ </h1>
            <p className="py-6">เข้าสู่ระบบเฉพาะพนักงาน </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ไอดี</span>
                </label>
                <input type="varchar" name="username" value={accountData.username} onChange={(e) => handleInputChange(e, setaccountData)} placeholder="email" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">พาสเวิร์ด</span>
                </label>
                <input type="password" name="password_hash" value={accountData.password_hash} onChange={(e) => handleInputChange(e, setaccountData)} placeholder="password" className="input input-bordered" required />

                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">ลืมรหัสผ่าน?</a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={handleSubmit}>เข้าสู่ระบบ</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
