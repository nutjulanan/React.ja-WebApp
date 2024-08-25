import React, { useState, useEffect } from 'react';
import './index.css';

export default function BookRepair() {
 
  return (
      <div className="container mx-auto p-4 ">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">จองนัดซ่อมรถยนต์</h1>

          <div className="flex justify-center gap-4 mb-6">
              
              <button className="btn2 btn-active btn-primary px-11 py-3 text-lg rounded-lg shadow-lg">จองนัดซ่อม</button>
              {/* <button className="btn btn-error px-8 py-3 text-lg rounded-lg shadow-lg">ยกเลิกการจอง</button> */}
          </div>

          <div className="flex flex-col items-center gap-4">
              <div className="form-control w-full max-w-md">
                  <label className="label">
                      <span className="label-text text-lg">ตรวจสอบการจอง</span>
                  </label>
                  <input type="text" className="input input-bordered w-full px-4 py-3 text-lg" />
              </div>

              <div className="dropdown">
                  <button tabIndex={0} className="btn px-8 py-3 text-lg rounded-lg shadow-lg">ตรวจสอบการจอง</button>
                  <div tabIndex={0} className="dropdown-content z-10 card card-compact w-64 p-2 shadow bg-primary text-primary-content">
                      <div className="card-body">
                          <h3 className="card-title">สถานะการจอง</h3>
                          <p>ไม่ได้เชื่อมต่อระบบ MongoDB</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="container mx-auto p-4">
          <h2>Services</h2>
      </div>
      </div>
  );
}
