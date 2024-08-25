import React, { useState, useEffect } from 'react';
import '../CSS/Main2.css'; // ตรวจสอบว่าไฟล์ CSS ถูกนำเข้าถูกต้อง

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Main2({ onViewChange, onSelectService }) {
  const [services, setServices] = useState([]);
  const [expandedServiceId, setExpandedServiceId] = useState(null);

  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/fetchAllservice`);
        if (!response.ok) throw new Error('Data fetch failed');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    
    fetchServices();
  }, []);

  // ฟังก์ชันที่ใช้ในการตั้งค่าและยกเลิกค่า expandedServiceId
  const handleExpandClick = (id) => {
    const selected = services.find(service => service.id === id);
    onSelectService(selected.service_name); // ส่งชื่อบริการไปยัง App
    setExpandedServiceId(expandedServiceId === id ? null : id);
    console.log(expandedServiceId);
  };
  return (
    <div  className="app-container ">
      <div className="scrollcard ">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`service-card rounded-full ${expandedServiceId === service.id ? 'expanded' : ''}`}
            onClick={() => handleExpandClick(service.id)}
          >
            <div className="card-content">
              {/* ตัวอย่างการแสดงราคาและคำอธิบายของ service */}
              <p className="service-description">{service.description}</p>
              <h2 className="text-center text-lg font-semibold my-2">{service.service_name}</h2>
              <p className="service-price"> ${service.unit_price}</p>
              {/* สามารถเพิ่มเนื้อหาเพิ่มเติมได้ตามต้องการ */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
