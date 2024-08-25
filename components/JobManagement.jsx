import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [formData, setFormData] = useState({
        responsible_Employee_id: '',
        car_id: '',
        car_in: '',
        car_out: '',
        car_finished: '',
        job_status: '',
        repair_details: '',
        customer_feedback: '',
        update_record: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAlljob`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await axios.put(`${VITE_API_URL}/Updatejobdata/${currentJobId}`, formData);
            } catch (error) {
                console.error('Error updating job:', error);
            }
        } else {
            try {
                await axios.post(`${VITE_API_URL}/Addjobdata`, formData);
            } catch (error) {
                console.error('Error adding job:', error);
            }
        }
        resetForm();
        fetchJobs();
    };

    const startEdit = (job) => {
        setFormData({ ...job });
        setIsEditing(true);
        setCurrentJobId(job.id);
    };

    const deleteJob = async (id) => {
        try {
            await axios.delete(`${VITE_API_URL}/deletejob/${id}`);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            responsible_employee_id: '',
            car_id: '',
            car_in: '',
            car_out: '',
            car_finished: '',
            job_status: '',
            repair_details: '',
            customer_feedback: '',
            update_record: ''
        });
        setIsEditing(false);
        setCurrentJobId(null);
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Jobs List</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
                        <th className="border p-2">Responsible Employee ID</th>
                        <th className="border p-2">Car ID</th>
                        {/* <th className="border p-2">Car In</th>
                        <th className="border p-2">Car Out</th> */}
                        <th className="border p-2">Car Finished</th>
                        <th className="border p-2">Job Status</th>
                        <th className="border p-2">Repair Details</th>
                        <th className="border p-2">Customer Feedback</th>
                        <th className="border p-2">Update Record</th>
                        <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-100">
                                <td className="border p-2">{job.responsible_employee_id}</td>
                                <td className="border p-2">{job.car_id}</td>
                                {/* <td className="border p-2">{job.car_in}</td>
                                <td className="border p-2">{job.car_out}</td> */}
                                <td className="border p-2">{job.car_finished ? 'Yes' : 'No'}</td>
                                <td className="border p-2">{job.job_status}</td>
                                <td className="border p-2">{job.repair_details}</td>
                                <td className="border p-2">{job.customer_feedback}</td>
                                <td className="border p-2">{job.update_record}</td>
                                <td className="border p-2">
                                    <button className="btn btn-sm btn-error" onClick={() => startEdit(job)}>Edit</button>
                                    <button className="btn btn-sm btn-info" onClick={() => deleteJob(job.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Job" : "Add Job"}</h2>
            <form onSubmit={handleSubmit}className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col">
                <input 
                    type="text"
                    name="responsible_Employee_id"
                    value={formData.responsible_Employee_id}
                    onChange={handleChange}
                    placeholder="Responsible Employee ID" className="input input-bordered  " 
                /> </div>
                <div className="flex flex-col">
                <input
                    type="text"
                    name="car_id"
                    value={formData.car_id}
                    onChange={handleChange}
                    placeholder="Car ID" className="input input-bordered " 
                /> </div>
                {/* <div className="flex flex-col">
                <input
                    type="datetime-local"
                    name="car_in"
                    value={formData.car_in}
                    onChange={handleChange}
                    placeholder="Car In" className="input input-bordered " 
                /> </div>
                <div className="flex flex-col">
                <input
                    type="datetime-local"
                    name="car_out"
                    value={formData.car_out}
                    onChange={handleChange}
                    placeholder="Car Out" className="input input-bordered " 
                /> </div>
                <div className="flex flex-col">
                <input
                    type="datetime-local"
                    name="car_finished"
                    value={formData.car_finished}
                    onChange={handleChange}
                    placeholder="Car Finished" className="input input-bordered " 
                /> </div> */}
                <div className="flex flex-col">
                <select name="job_status" value={formData.job_status} onChange={handleChange} className="input input-bordered " >
                    <option value="">Select Job Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select> </div>
                <div className="flex flex-col">
                <textarea
                    name="repair_details"
                    value={formData.repair_details}
                    onChange={handleChange}
                    placeholder="Repair Details" className="input input-bordered " 
                /> </div>
                <div className="flex flex-col"> 
                <textarea
                    name="customer_feedback"
                    value={formData.customer_feedback}
                    onChange={handleChange}
                    placeholder="Customer Feedback" className="input input-bordered " 
                /> </div>
                <div className="flex flex-col">
                <input
                    type="text"
                    name="update_record"
                    value={formData.update_record}
                    onChange={handleChange}
                    placeholder="Update Record" className="input input-bordered " 
                /> </div>
                <div className="flex flex-col">
                </div>
             
            </form>
                <button type="submit" className="btn btn-primary">{isEditing ? "Save Changes" : "Add Job"}</button>
            </div>
        </div>
    );
};

export default JobManagement;
