import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');

  useEffect(() => {
    // เรียก API เพื่อดึงข้อมูลพนักงาน
    axios.get(`${VITE_API_URL}/fetchAllWorkforceInformation`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleEmployeeChange = (event) => {
    const selectedId = event.target.value;
    const selectedName = event.target[event.target.selectedIndex].text;
    setSelectedEmployeeId(selectedId);
    setSelectedEmployeeName(selectedName);
  }

  return (
    <div>
      <h1>เลือกรายชื่อพนักงาน</h1>
      <select value={selectedEmployeeId} onChange={handleEmployeeChange}>
        <option value="">โปรดเลือก</option>
        {employees.map(employee => (
          <option key={employee.id} value={employee.id}>
            {employee.full_name}
          </option>
        ))}
      </select>
      {selectedEmployeeId && (
        <div>
          <h2>ข้อมูลพนักงานที่เลือก:</h2>
          <p>ID: {selectedEmployeeId}</p>
          <p>ชื่อ: {selectedEmployeeName}</p>
        </div>
      )}
    </div>
  );
}

export default App;
