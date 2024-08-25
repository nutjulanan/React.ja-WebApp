import React, { useState } from 'react';
export default function Employee_permissions() {

    // State และ handlers สำหรับแต่ละ checkbox
    const [isChecked1, setIsChecked1] = useState(true);
    const [isChecked2, setIsChecked2] = useState(true);
    const [isChecked3, setIsChecked3] = useState(true);
    const [isChecked4, setIsChecked4] = useState(true);

    const handleCheckboxChange1 = (event) => {
        setIsChecked1(event.target.checked);
    };
    const handleCheckboxChange2 = (event) => {
        setIsChecked2(event.target.checked);
    };
    const handleCheckboxChange3 = (event) => {
        setIsChecked3(event.target.checked);
    };
    const handleCheckboxChange4 = (event) => {
        setIsChecked4(event.target.checked);
    };



    return (
        <>
        <br></br>
        <h1 className="text-3xl"> ตั้งค่าสิทธิ์การเข้าใช้งานระบบ</h1><br></br>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <label className="form-control w-full max-w-xs">
        <div className="label">
            <span className="label-text">ค้ณหารายชื่อพนักงาน</span>       
            </div>
            <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
            <br></br>
                    <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">ค้ณหา</div>
                    <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content">
                        <div className="card-body">
                        <h3 className="card-title">ไม่พบชื่อในระบบ</h3>
                         <p>ไม่ได้เชื่อมต่อระบบ MongoDB</p>
                        </div>
                    </div>
                    </div>

            <div className="label">           
            </div>
            </label>  
        </div>
        <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                        <tr>
                            <th></th>
                            <th>ชื่อ</th>
                            <th>รายละเอียด</th>
                            <th>เลือก</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>1</th>
                            <td>ช่างสมชาย</td>
                            <td>xxxxxxxx</td>
                                <label className="label">
                                <input type="checkbox" 
                                name="Monday"className="checkbox checkbox-bordered" /><button className="btn btn-sm l+3">แก้ไข</button>
                                </label>
                        </tr>
                        {/* row 2 */}
                        <tr>
                            <th>2</th>
                            <td>ช่างสาย </td>
                            <td>xxxxxxxx</td>
                            <label className="label">
                                <input type="checkbox" name="Monday"className="checkbox checkbox-bordered" /> <button className="btn btn-sm l+3">แก้ไข</button>
                                </label>
                        </tr>
                        {/* row 3 */}
                        <tr>
                            <th>3</th>
                            <td>ช่างจุ้มเม่ง</td>
                            <td>xxxxxxxx</td>
                            <label className="label">
                                <input type="checkbox" name="Monday"className="checkbox checkbox-bordered" /><button className="btn btn-sm l+3">แก้ไข</button>
                            </label>
                        </tr>
                        </tbody>
                    </table>
                </div>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">ช่าง</span>       
                </div>
                    <select className="select select-bordered w-full max-w-xs">
                    <option disabled selected>เลือก</option>                   
                    <option>ช่างสมชาย</option>
                    <option>ช่างสาย</option>
                    <option>ช่างจุ้มเม่ง</option>
                    <option>none</option>
                    </select>
                <div className="label">           
                </div>
            </label>

            
            <div className="flex flex-col">

            <div className="form-control w-52">
                <label className="cursor-pointer label">
                    <span className="label-text">ระบบรับซ่อมรถยนต์</span> 
                <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={isChecked1} 
                    onChange={handleCheckboxChange1} 
                    
                />
                </label>

                <label className="cursor-pointer label">
                    <span className="label-text">จัดการคลังสินค้า</span> 
                <input 
                    type="checkbox" 
                    className="toggle toggle-success" 
                    checked={isChecked2} 
                    onChange={handleCheckboxChange2} 
                    
                />
                </label>

                <label className="cursor-pointer label">
                    <span className="label-text">ใบเบิก</span> 
                <input 
                    type="checkbox" 
                    className="toggle toggle-warning" 
                    checked={isChecked3} 
                    onChange={handleCheckboxChange3} 
                    
                />
                </label>
                
                <label className="cursor-pointer label">
                    <span className="label-text">สร้างใบเสนอราคา</span> 
                <input 
                    type="checkbox" 
                    className="toggle toggle-info" 
                    checked={isChecked4} 
                    onChange={handleCheckboxChange4} 
                    
                />
                </label>
                

                </div>

            </div>
            <div className="flex justify-center space-x-2">
            <button className="btn btn-active btn-accent px-5 py-2">บันทึก</button>
            <button className="btn btn-error px-5 py-2 ">ยกเลิก</button>
                </div>

        </>
    );
  }
  