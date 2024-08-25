
import React, { useState, useEffect } from 'react';
import './CSS/InfiniteScroll.css'; 

const VITE_API_URL = import.meta.env.VITE_API_URL;

const InfiniteScroll = () => {
  const [services, setServices] = useState([]);

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

  return (
    <div className="infinite-scroll-container">
        <div className="scroll" style={{ '--time': '90s' }}>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
      </div>
      <div className="scroll" style={{ '--time': '150s' }}>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
      </div>
      <div className="scroll" style={{ '--time': '50s' }}>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
      </div>
      <div className="scroll" style={{ '--time': '70s' }}>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
      </div>
      <div className="scroll" style={{ '--time': '50s' }}>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
      </div>
      <div className="scroll" style={{ '--time': '20s' }}>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
        <div>
          {services.map((service, index) => (
            <span key={index}>{service.service_name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;
