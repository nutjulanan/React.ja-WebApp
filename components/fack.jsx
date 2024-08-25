import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

const AddCarForm = ({ car, onCarAddedOrEdited }) => {
    const [formData, setFormData] = useState({
        registration_id: car ? car.registration_id : '',
        owner_id: car ? car.owner_id : '',
        policy_number: car ? car.policy_number : '',
        insurance_company: car ? car.insurance_company : '',
        insurance_expiry_date: car ? car.insurance_expiry_date : '',
        car_type: car ? car.car_type : '',
        brand: car ? car.brand : '',
        model: car ? car.model : '',
        year: car ? car.year : '',
        color: car ? car.color : '',
        engine_number: car ? car.engine_number : '',
        chassis_number: car ? car.chassis_number : '',
        gear_type: car ? car.gear_type : '',
        detail: car ? car.detail : '',
        update_record: car ? car.update_record : ''
    });

    useEffect(() => {
        if (car) {
            setFormData({
                registration_id: car.registration_id,
                owner_id: car.owner_id,
                policy_number: car.policy_number,
                insurance_company: car.insurance_company,
                insurance_expiry_date: car.insurance_expiry_date,
                car_type: car.car_type,
                brand: car.brand,
                model: car.model,
                year: car.year,
                color: car.color,
                engine_number: car.engine_number,
                chassis_number: car.chassis_number,
                gear_type: car.gear_type,
                detail: car.detail,
                update_record: car.update_record
            });
        }
    }, [car]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (car) {
                await axios.put(`${VITE_API_URL}/updateCar/${car.id}`, formData);
            } else {
                await axios.post(`${VITE_API_URL}/Addcardata`, formData);
            }
            alert(`Car ${car ? 'updated' : 'added'} successfully!`);
            onCarAddedOrEdited();
        } catch (error) {
            console.error(`Failed to ${car ? 'update' : 'add'} car:`, error);
            alert(`Failed to ${car ? 'update' : 'add'} car. Please try again.`);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="mb-4 bg-base-100 shadow-xl rounded-lg p-4">
                <h2 className="text-3xl font-semibold mb-5">{car ? 'Edit Car' : 'Add New Car'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="registration_id" className="text-sm font-medium text-gray-400 mb-1">Registration ID</label>
                        <input type="text" name="registration_id" value={formData.registration_id} onChange={handleChange} placeholder="Registration ID" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="owner_id" className="text-sm font-medium text-gray-400 mb-1">Owner ID</label>
                        <input type="text" name="owner_id" value={formData.owner_id} onChange={handleChange} placeholder="Owner ID" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="policy_number" className="text-sm font-medium text-gray-400 mb-1">Policy Number</label>
                        <input type="text" name="policy_number" value={formData.policy_number} onChange={handleChange} placeholder="Policy Number" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="insurance_company" className="text-sm font-medium text-gray-400 mb-1">Insurance Company</label>
                        <input type="text" name="insurance_company" value={formData.insurance_company} onChange={handleChange} placeholder="Insurance Company" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="insurance_expiry_date" className="text-sm font-medium text-gray-400 mb-1">Insurance Expiry Date</label>
                        <input type="date" name="insurance_expiry_date" value={formData.insurance_expiry_date} onChange={handleChange} required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="car_type" className="text-sm font-medium text-gray-400 mb-1">Car Type</label>
                        <input type="text" name="car_type" value={formData.car_type} onChange={handleChange} placeholder="Car Type" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="brand" className="text-sm font-medium text-gray-400 mb-1">Brand</label>
                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="model" className="text-sm font-medium text-gray-400 mb-1">Model</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="year" className="text-sm font-medium text-gray-400 mb-1">Year</label>
                        <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Year" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="color" className="text-sm font-medium text-gray-400 mb-1">Color</label>
                        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="engine_number" className="text-sm font-medium text-gray-400 mb-1">Engine Number</label>
                        <input type="text" name="engine_number" value={formData.engine_number} onChange={handleChange} placeholder="Engine Number" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="chassis_number" className="text-sm font-medium text-gray-400 mb-1">Chassis Number</label>
                        <input type="text" name="chassis_number" value={formData.chassis_number} onChange={handleChange} placeholder="Chassis Number" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="gear_type" className="text-sm font-medium text-gray-400 mb-1">Gear Type</label>
                        <input type="text" name="gear_type" value={formData.gear_type} onChange={handleChange} placeholder="Gear Type" required className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="detail" className="text-sm font-medium text-gray-400 mb-1">Detail</label>
                        <textarea name="detail" value={formData.detail} onChange={handleChange} placeholder="Detail" required className="textarea textarea-bordered w-full"></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="update_record" className="text-sm font-medium text-gray-400 mb-1">Update Record</label>
                        <input type="text" name="update_record" value={formData.update_record} onChange={handleChange} placeholder="Update Record" className="input input-bordered w-full" />
                    </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">{car ? 'Update Car' : 'Add Car'}</button>
                </form>
            </div>
        </div>
    );
};

const ShowAllCarData = ({ setEditingCar, handleDeleteCar }) => {
    const [carData, setCarData] = useState([]);

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/fetchAllcar`);
                setCarData(response.data);
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
        };
        fetchCarData();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Car Data</h2>
            <table className="w-full border-collapse table-auto">
            <thead>
                <tr className="bg-base-100 shadow-xl rounded-lg p-4">
                    <th className="border p-2">Registration ID</th>
                    <th className="border p-2">Owner ID</th>
                    <th className="border p-2">Policy Number</th>
                    <th className="border p-2">Insurance Company</th>
                    <th className="border p-2">Insurance Expiry Date</th>
                    <th className="border p-2">Car Type</th>
                    <th className="border p-2">Brand</th>
                    <th className="border p-2">Model</th>
                    <th className="border p-2">Year</th>
                    <th className="border p-2">Color</th>
                    <th className="border p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {carData.map(car => (
                    <tr key={car.id} className="hover:bg-gray-100">
                        <td className="border p-2">{car.registration_id}</td>
                        <td className="border p-2">{car.owner_id}</td>
                        <td className="border p-2">{car.policy_number}</td>
                        <td className="border p-2">{car.insurance_company}</td>
                        <td className="border p-2">{car.insurance_expiry_date}</td>
                        <td className="border p-2">{car.car_type}</td>
                        <td className="border p-2">{car.brand}</td>
                        <td className="border p-2">{car.model}</td>
                        <td className="border p-2">{car.year}</td>
                        <td className="border p-2">{car.color}</td>
                        <td className="border p-2">
                            <div className="flex items-center justify-start space-x-2">
                                <button onClick={() => setEditingCar(car)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                                <button onClick={() => handleDeleteCar(car.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>

            </table>
        </div>
    );
};

const CarManagementPage = () => {
    const [editingCar, setEditingCar] = useState(null);

    const handleCarAddedOrEdited = () => {
        setEditingCar(null);
        // Trigger to refresh the car list
    };

    const handleDeleteCar = async (carId) => {
        try {
            await axios.delete(`${VITE_API_URL}/deleteCar/${carId}`);
            handleCarAddedOrEdited(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting car:', error);
            alert('Failed to delete car. Please try again.');
        }
    };

    return (
        <> 
            <div className="container mx-auto mt-8">
                <ShowAllCarData setEditingCar={setEditingCar} handleDeleteCar={handleDeleteCar} />
                <AddCarForm car={editingCar} onCarAddedOrEdited={handleCarAddedOrEdited} />
            </div>
        </>
    );
};

export default CarManagementPage;
