
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Daywork from './Book/Daywork';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
const GarageForm = () => {
    const [garage, setGarage] = useState(null);

    useEffect(() => {
        const fetchGarageData = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/garage/1`); // ใช้ endpoint ที่เหมาะสม
                setGarage(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchGarageData();
    }, []);

    if (!garage) return <div>Loading...</div>;

    return (
      <div class="flex items-center justify-center">
      <div id="main4Section" class="flex flex-col md:flex-row items-center justify-center p-4 max-w-4xl mx-auto">
        <div class="md:w-1/2">
          <h3 class="text-2xs font-bold mb-4">ช่องทางติดต่อ</h3>
          <div class="bg-white shadow-md rounded-lg p-6">
            <p class="font-semibold"><span class="text-gray-600"></span> {garage.garage_name}</p>
            <p class="font-semibold"><span class="text-gray-600">เบอร์โทร:</span> {garage.telephone_number}</p>
            <p class="font-semibold"><span class="text-gray-600">ที่อยู่:</span> {garage.address}</p>
            <p class="font-semibold"><span class="text-gray-600">อีเมล:</span> {garage.email}</p>
            <p class="font-semibold"><span class="text-gray-600">Line ID:</span> {garage.line_id}</p>
            <p class="font-semibold"><span class="text-gray-600">เปิด-ปิดให้บริการ:</span> {garage.workinghours}</p>
            <p class="font-semibold"><span class="text-gray-600">รายละเอียด:</span> {garage.detail_garages}</p>
          </div>
        </div>
        <div class="md:w-1/2 md:ml-4 mt-4 md:mt-0">
          <Daywork/>
        </div>
      </div>
    </div>
    

  
    );
};

export default GarageForm;
