import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

const EditJobForm = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...job });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${VITE_API_URL}/Updatejobdata/${job.id}`, formData);
      onSave(); // โหลดข้อมูลใหม่ใน JobsTable
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Employee ID:
        <input type="text" name="responsible_Employee_id" value={formData.responsible_Employee_id} onChange={handleChange} />
      </label>
      <label>
        Car ID:
        <input type="text" name="car_id" value={formData.car_id} onChange={handleChange} />
      </label>
      <label>
        Job Status:
        <input type="text" name="job_status" value={formData.job_status} onChange={handleChange} />
      </label>
      <label>
        Repair Details:
        <textarea name="repair_details" value={formData.repair_details} onChange={handleChange} />
      </label>
      <label>
        Customer Feedback:
        <textarea name="customer_feedback" value={formData.customer_feedback} onChange={handleChange} />
      </label>
      <label>
        Update Record:
        <input type="text" name="update_record" value={formData.update_record} onChange={handleChange} />
      </label>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditJobForm;
