import React from 'react';

export default function Web_services({onClose},{onClick}) {

  const services = [
    {
      title: "[บริการต่างๆ]",
      description: "ซ่อมรถทุกอาการ ปรึกษารถเสีย มีปัญหาเรื่องราคาซ่อมรถ",
      imageUrl: "https://media.istockphoto.com/id/960666672/photo/vehicle-repair-maintenance-concept-photo.webp?b=1&s=170667a&w=0&k=20&c=xZs1fzWGaYdrR9IOUOCIoPOUuqQxuu8pn-L8WlRzjO0="
    },
    // เพิ่ม object สำหรับ service ที่ต้องการทำซ้ำ
  ];
  return (
    <>
    <div className="container_card">
        <div className="card1 w-96 glass m-2">
            <figure><img src="https://media.istockphoto.com/id/960666672/photo/vehicle-repair-maintenance-concept-photo.webp?b=1&s=170667a&w=0&k=20&c=xZs1fzWGaYdrR9IOUOCIoPOUuqQxuu8pn-L8WlRzjO0=" alt="car!"/></figure>
            <div className="card-body">
                <h2 className="card-title">[ซ่อมรถทุกอาการ]</h2>              
          <blockquote>
          ปรึกษารถเสียมีปัญหาเรื่องราคาซ่อมรถนัดหมายจองคิวให้เราช่วยดูแลซ่อม.
          </blockquote>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>

        <div className="card2 w-96 glass m-2">
            <figure><img src="https://media.istockphoto.com/id/960666672/photo/vehicle-repair-maintenance-concept-photo.webp?b=1&s=170667a&w=0&k=20&c=xZs1fzWGaYdrR9IOUOCIoPOUuqQxuu8pn-L8WlRzjO0=" alt="car!"/></figure>
            <div className="card-body">
            <h2 className="card-title">[เช็คระยะ เปลี่ยนถ่ายน้ำมันเครื่อง]</h2>              
          <blockquote>
          สะดวกและคุ้มค่าพร้อมตรวจเช็คสภาพรถฟรี34รายการโดยศูนย์บริการที่ได้รับเริ่มต้น950บาท .
          </blockquote>
                <div className="card-actions justify-end"></div>
            </div>
        </div>

        <div className="card3 w-96 glass m-2">
            <figure><img src="https://media.istockphoto.com/id/960666672/photo/vehicle-repair-maintenance-concept-photo.webp?b=1&s=170667a&w=0&k=20&c=xZs1fzWGaYdrR9IOUOCIoPOUuqQxuu8pn-L8WlRzjO0=" alt="car!"/></figure>
            <div className="card-body">
            <h2 className="card-title">[สุดคุ้ม เหมาจ่าย ปลอดภัยตลอด 3 ปี]</h2>              
          <blockquote>
          แพ็กเกจสุดคุ้มเหมาจ่ายให้เราดูแลรถของคุณตลอดอายุการใช้งาน3ปีเริ่มมต้น7,500 บาท           
          </blockquote>
                <div className="card-actions justify-end"></div>
            </div>
        </div>
        <div className="card4 w-96 glass m-2">
            <figure><img src="https://media.istockphoto.com/id/960666672/photo/vehicle-repair-maintenance-concept-photo.webp?b=1&s=170667a&w=0&k=20&c=xZs1fzWGaYdrR9IOUOCIoPOUuqQxuu8pn-L8WlRzjO0=" alt="car!"/></figure>
            <div className="card-body">
            <h2 className="card-title">[ซ่อมรถทุกอาการ]</h2>              
          <blockquote>
          ปรึกษารถเสียมีปัญหาเรื่องราคาซ่อมรถนัดหมายจองคิวให้เราช่วยดูแลซ่อม.
          </blockquote>
                <div className="card-actions justify-end"></div>
            </div>
        </div>
    </div>
        <button className="btn close btn-square" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    </>
  );
}
