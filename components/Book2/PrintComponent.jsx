import React from 'react';
import './PrintComponent.css'; // สมมติว่าคุณมีการกำหนดสไตล์พื้นฐานเพิ่มเติมที่นี่
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

const PrintComponent = React.forwardRef(({
  services,
  repairs,
  totalCost,
  grandTotal,
  discount,
  wages,
  customerInfo,
  selectedCar,
  selectedServices,
  selectedEmployee,
  cart,

}, ref) => {
  const currentDate = new Date().toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const cartDetails = cart.map(item => `${item.name} - จำนวน: ${item.quantity}, ราคา: ${item.price.toFixed(2)}`).join(', ');
  return (
    <div ref={ref} className="printContainer p-8">
      <h1 className="header text-center text-3xl font-bold mb-6">ใบเสร็จรับเงิน อู่ซ่อมรถยนต์</h1>

      {customerInfo && (
        <div className="customerInfo mb-4">
          <h2 className="text-xl font-semibold mb-2">ข้อมูลลูกค้า:</h2>
          <p>ชื่อ: {customerInfo.full_name || 'N/A'}</p>
          <p>อีเมล: {customerInfo.e_mail || 'N/A'}</p>
          <p>โทรศัพท์: {customerInfo.tele_number || 'N/A'}</p>
          <p>ที่อยู่: {customerInfo.address || 'N/A'}</p>
          <p>รายละเอียด: {customerInfo.detail || 'N/A'}</p>
        </div>
      )}

      {selectedCar && (
        <div className="carInfo mb-4">
          <h2 className="text-xl font-semibold mb-2">ข้อมูลรถยนต์:</h2>
          <p>ป้ายทะเบียน: {selectedCar.registration_id || 'N/A'}</p>
          <p>ยี่ห้อ: {selectedCar.egistration_id || 'N/A'}</p>
          <p>รุ่น: {selectedCar.model || 'N/A'}</p>
          <p>ปี: {selectedCar.year || 'N/A'}</p>
          <p>สี: {selectedCar.color || 'N/A'}</p>
        </div>
      )}

      <p>วันที่พิมพ์: {currentDate}</p>

      <div className="servicesInfo mb-4">
        <h2 className="text-xl font-semibold mb-2">บริการที่เลือก:</h2>
        <ul className="list-disc pl-5">
          {selectedServices.map((service) => (
            <li key={service.id}>
              แพ็คเกจ: {service.service_name || 'N/A'}, ราคา: {service.unit_price || 'N/A'} บาท, รายละเอียด: {service.description || 'N/A'}
            </li>
          ))}
        </ul>
        {/* <ul className="list-disc pl-5">
          {services.filter(service => repairs.find(repair => repair.id === service.id)).map(service => (
            <li key={service.id}>{service.service_name} - {service.unit_price} บาท</li>
          ))}
        </ul> */}
      </div>
      รายการเพิ่มเติม{cartDetails}
      {selectedEmployee && <div>ช่าง: {selectedEmployee}</div>}

      <div className="repairsInfo mb-4">
        <h2 className="text-xl font-semibold mb-2">รายการซ่อม:</h2>
        <ul className="list-disc pl-5">
          {repairs.map(repair => (
            <li key={repair.id}>{repair.description} - {repair.cost} บาท</li>
          ))}
        </ul>
      </div>

      <p>ส่วนลด: {discount} บาท</p>
      <p>ค่าแรงช่าง: {wages} บาท</p>
      <p>รวมราคาบริการ: {totalCost} บาท</p>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>ราคาสุทธิ : {grandTotal} บาท</h1>
    </div>
  );
});

export default PrintComponent;
