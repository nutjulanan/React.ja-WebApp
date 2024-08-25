import React, { useState, useEffect } from 'react';
import Main2 from "../Main2";
import Main3 from "../Main3";
import Reservation_search_customer from "../Reservation_search_customer";
import Book_repair from '../Book_repair';
import Web_services from "../Web_services";
import Reservation_add from '../Reservation_add';
import Parallax from '../Parallax';
import InfiniteScroll from '../InfiniteScroll';
import Login from '../Login/Login';
import Garage from '../Garage';
import GarageForm from '../About';
import '../CSS/Main1.css';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Main1({ onLogin }) {
  const [selectedService, setSelectedService] = useState("");
  const [garageName, setGarageName] = useState('Loading...'); // ตั้งค่าเริ่มต้นเป็น 'Loading...'
  const scrollToTop = () => {  //สกอเมาอ์เลื่อนขึ้นไปด้านบน
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  useEffect(() => {
    fetch(`${VITE_API_URL}/garage/1`) // ใช้ /garage/1 แทน /garages/1
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setGarageName(data.garage_name);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
        setGarageName('Failed to load data');
      });
  }, []);

  const scrollToLogin = () => {
    const loginSection = document.getElementById("loginSection");
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToMain4 = () => {
    const main4Section = document.getElementById("main4Section");
    if (main4Section) {
      main4Section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToMain3 = () => {
    const main3Section = document.getElementById("main3Section");
    if (main3Section) {
      main3Section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToMain2 = () => {
    const main2Section = document.getElementById("main2Section");
    if (main2Section) {
      main2Section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToMain1 = () => {
    const main1Section = document.getElementById("main1Section");
    if (main1Section) {
      main1Section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [currentView, setCurrentView] = useState('Main2');

  const showMain2 = () => {
    setCurrentView('Main2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showWebServices = () => {
    setCurrentView('Web_services');
  };

  return (
    <div className="app-container max-w-[1250px] mx-auto">
      <div className="navbar h-16 bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a onClick={scrollToMain1}>จองนัดซ่อม</a></li>
              <li><a onClick={scrollToMain2}>เช็คการจอง</a></li>
              <li><a onClick={scrollToMain3}>เช็คการจอง</a></li>
              <li><a onClick={scrollToMain4}>ติดต่อ</a></li>

            </ul>
          </div>
          <a className="btn btn-ghost text-xl" onClick={scrollToTop}>{garageName}</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a onClick={scrollToMain1}>จองนัดซ่อม</a></li>
            <li><a onClick={scrollToMain2}>เช็คการจอง</a></li>
            <li><a onClick={scrollToMain3}>เช็คความคืบหน้า</a></li>
            <li><a onClick={scrollToMain4}>ติดต่อ</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn btn-ghost rounded-btn" onClick={scrollToLogin}>เข้าสู่ระบบ</a>
        </div>
      </div>
      {/* <div >
          <div className="navbar bg-base-100 rounded-box">
            <div className="flex-1 px-2 lg:flex-none">
              <a className="btn btn-ghost text-xl" onClick={scrollToTop}>อู่นพดลการช่าง</a>
            </div> 
            <div className="flex justify-end flex-1 px-2">
              <div className="flex items-stretch">
                <a className="btn btn-ghost rounded-btn" onClick={scrollToLogin}>เข้าสู่ระบบ</a>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">เมนู</div>
                  <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li><a>Item 1</a></li> 
                    <li><a>Item 2</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      {/* <div className="parallax-container">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '40vh',
              textAlign: 'center'
            }}>
            <InfiniteScroll />
            </div>
          </div> */}

      {/* {currentView === 'Main2' ? (
          <Main2 onViewChange={showWebServices} />
          ) : (
            <Web_services onClose={showMain2} />
          )} */}
      <div >
        <Parallax />
      </div>
      <div className="flex flex-col md:flex-row mt-4 mb-4 md:mt-8 md:mb-8">
        <div className="md:w-1/2">
          <Main2 onSelectService={setSelectedService} />
        </div>
        <div className="md:w-1/2">
          <Reservation_add selectedService={selectedService} />
        </div>
      </div>
      {/* <Garage garageName={garageName} /> */}
      <Reservation_search_customer />
      <Main3 />
      <Login />
      <GarageForm/>
    </div>
  );
}
