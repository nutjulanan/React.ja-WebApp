import React, { useState, useEffect } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function ServiceManagement() {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
    let navigate = useNavigate();
    const fetchPermission = async () => {
        try {
            const data_id = JSON.parse(localStorage.getItem('data_id'));
            const response๘work_roles_permissions = await axios.get(`${VITE_API_URL}/work_roles_permissions/${data_id.id}`);
            const additionalInfos = response๘work_roles_permissions.data;
            const all_role = []
            for (const additionalInfo of additionalInfos) {
                if (additionalInfo.role_id !== undefined) {
                    const responseroles = await axios.get(`${VITE_API_URL}/fetchroles_permissionsById/${additionalInfo.role_id}`);
                    const additionalInforoles = responseroles.data;
                    all_role.push({
                        ...additionalInforoles,
                    });
                } else {
                    console.error('role_id is undefined for item:', item);
                }
            }
            if (!all_role.some(permission => permission["inventorystock"] === true)) {
                navigate('/garage');
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }
    useEffect(() => {
        fetchPermission()
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ service_name: '', unit_price: '', description: '', update_record: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        const data_id = JSON.parse(localStorage.getItem('data_id'));
        form.update_record = data_id.full_name
        e.preventDefault();
        const url = editingId ? `${VITE_API_URL}/Updateservice/${editingId}` : `${VITE_API_URL}/Addservicedata`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!response.ok) throw new Error('Operation failed');
            fetchServices();
            setForm({ service_name: '', unit_price: '', description: '', update_record: '' });
            setEditingId(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteService = async (id) => {
        try {
            const response = await fetch(`${VITE_API_URL}/deleteservice/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Delete operation failed');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const startEdit = (service) => {
        setForm({ ...service });
        setEditingId(service.id);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">ระบบจัดการ เซอร์วิสและบริการ</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <input type="text" name="service_name" placeholder="ชื่อ-เซอร์วิส" value={form.service_name} onChange={handleChange} className="input input-bordered w-full" />
                    <input type="text" name="unit_price" placeholder="ราคา" value={form.unit_price} onChange={handleChange} className="input input-bordered w-full" />
                    <textarea name="description" placeholder="รายละเอียด" value={form.description} onChange={handleChange} className="textarea textarea-bordered w-full"></textarea>
                    {/* <input type="text" name="update_record" placeholder="ผู้บันทึก" value={form.update_record} onChange={handleChange} className="input input-bordered w-full" /> */}
                </div>
                <button type="submit" className="btn btn-primary">{editingId ? 'อัพเดท เซอร์วิส' : 'เพิ่ม เซอร์วิส'}</button>
            </form>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ชื่อเซอร์วิส</th>
                            <th>ราคา</th>
                            <th>รายละเอียด</th>
                            <th>ผู้บันทึก</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.service_name}</td>
                                <td>{service.unit_price}</td>
                                <td>{service.description}</td>
                                <td>{service.update_record}</td>
                                <td>
                                <div className="flex items-center justify-center space-x-2"> 
                                    <button onClick={() => startEdit(service)} className="btn btn-sm  mr-2">แก้ไข</button>
                                    <button onClick={() => deleteService(service.id)} className="btn btn-sm btn-error">ลบ</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
