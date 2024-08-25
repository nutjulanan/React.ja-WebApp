import React, { useState, useEffect } from 'react';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables
export default function BookRepair2() {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/fetchAllservice`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error("There was an error fetching the service data:", error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (!term.trim()) {
            setSearchResults([]);
        } else {
            const filteredResults = services.filter(service =>
                service.service_name.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredResults);
        }
    };

    const handleSelectService = (service) => {
        const isSelected = selectedServices.find(s => s.id === service.id);
        if (isSelected) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    // คำนวณยอดรวมเงินของบริการที่เลือก
    const totalAmount = selectedServices.reduce((total, service) => total + service.unit_price, 0);
    /////////////รายการซ่อมแบบป้อนผ่านinput////////////
    const [repairs, setRepairs] = useState([]);
    const handleSubmit = (event) => {
        event.preventDefault();
        const { description, cost } = event.target.elements;
        if (!description.value || !cost.value) return;
        setRepairs([...repairs, { id: Date.now(), description: description.value, cost: parseFloat(cost.value) }]);
        description.value = '';
        cost.value = '';
    };
    const handleDeleteRepair = (id) => {
        setRepairs(repairs.filter(repair => repair.id !== id));
    };
    const totalCost_B = repairs.reduce((acc, repair) => acc + repair.cost, 0);
    /////////////รายการซ่อมแบบป้อนผ่านinput////////////
     // คำนวณยอดรวมเงินของรายการซ่อมรถยนต์
     const totalCost = repairs.reduce((acc, repair) => acc + repair.cost, 0);
     // รวมยอดรวมทั้งหมด
     const grandTotal = totalAmount + totalCost;

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="ค้นหาบริการ..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button type="submit">ค้นหา</button>
            </form>
            {searchResults.length > 0 && (
                <ul>
                    {searchResults.map((service) => (
                        <li key={service.id}>
                            {service.service_name} - {service.unit_price} - {service.description}
                            <button onClick={() => handleSelectService(service)}>
                                {selectedServices.find(s => s.id === service.id) ? 'ยกเลิก' : 'เลือก'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {selectedServices.length > 0 && (
                <div>
                    <h2>บริการที่เลือก:</h2>
                    <ul>
                        {selectedServices.map((service) => (
                            <li key={service.id}>{service.service_name} - {service.unit_price} - {service.description}</li>
                        ))}
                    </ul>
                    <h3>รวม: {totalAmount} บาท</h3>
                </div>
            )}
            {/* ////////////รายการซ่อมแบบป้อนผ่านinput/////////// */}
            <form className="create-repair" onSubmit={handleSubmit}>
                <input name="description" type="text" placeholder="รายการซ่อม" />
                <input name="cost" type="number" placeholder="ราคา" />
                <button type="submit">เพิ่ม</button>
            </form>
            <div className="car-repair-list">
                <h1>รายการซ่อมรถยนต์</h1>
                {repairs.map(repair => (
                    <div key={repair.id} className="repair-item">
                        <span>{repair.description}</span>
                        <span>{repair.cost}</span>
                        <button onClick={() => handleDeleteRepair(repair.id)}>ลบ</button>
                    </div>
                ))}
                <div className="total-cost">รวม: {totalCost}</div>
                <h3>ยอดรวมเงินทั้งหมด: {grandTotal} บาท</h3>
            </div>
            {/* /////////////รายการซ่อมแบบป้อนผ่านinput//////////// */}
        </div>
    );
}
