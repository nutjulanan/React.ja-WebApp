import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Create_Quotation_add(props) {
    const [displayComponent, setDisplayComponent] = useState("Holidays_search");


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const componentRef = useRef();

    const [carquery, setcarQuery] = useState('');
    const [carresults, setcarResults] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerInfo, setCustomerInfo] = useState(null);

    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('');


    const [searchTerms, setSearchTerms] = useState('');
    const [items, setItems] = useState({});
    const [filteredItems, setFilteredItems] = useState({});
    const [repairs, setRepairs] = useState([]);
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState('all');

    const totalCost = repairs.reduce((acc, repair) => acc + repair.cost, 0);
    const totalAmount = selectedServices.reduce((total, service) => total + service.unit_price, 0);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const categorizeItems = (items) => {
        return items.reduce((acc, item) => {
            const { type } = item;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        }, {});
    };

    const handleSelectCar = (car) => {
        setSelectedCar(car);
        fetchCustomerData(car.owner_id);
    };

    const fetchCustomerData = async (ownerId) => {
        try {
            const response = await fetch(`${VITE_API_URL}/fetchAllcustomerById/${ownerId}`);
            const data = await response.json();
            setCustomerInfo(data);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        } finally {
        }
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer); // อัพเดตข้อมูลลูกค้าที่เลือก
        setSelectedCustomerId(customer.id);
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const { description, cost } = event.target.elements;
        if (!description.value || !cost.value) return;
        setRepairs([...repairs, { id: Date.now(), description: description.value, cost: parseFloat(cost.value) }]);
        description.value = '';
        cost.value = '';
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSelectService = (service) => {
        const isSelected = selectedServices.find(s => s.id === service.id);
        if (isSelected) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleDeleteRepair = (id) => {
        setRepairs(repairs.filter(repair => repair.id !== id));
    };

    const handleSearchCart = (e) => {
        e.preventDefault();
        let filtered = category !== 'all' ? { [category]: items[category].filter(item => item.name.toLowerCase().includes(searchTerms.toLowerCase())) } : Object.keys(items).reduce((acc, cat) => {
            acc[cat] = items[cat].filter(item => item.name.toLowerCase().includes(searchTerms.toLowerCase()));
            return acc;
        }, {});
        setFilteredItems(filtered);
    };

    const handleEmployeeChange = (event) => {
        const selectedId = event.target.value;
        const selectedName = event.target[event.target.selectedIndex].text;
        setSelectedEmployeeId(selectedId);
        setSelectedEmployeeName(selectedName);
    }

    const handleChange_money = (event) => {
        let value = event.target.value;
        // ลบคอมม่าและตรวจสอบว่าป้อนเป็นตัวเลขเท่านั้น
        value = value.replace(/,/g, '');
        if (/^[0-9]*$/.test(value)) {
            // จัดรูปแบบตัวเลขใหม่และเพิ่มคอมม่า
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            setPrice(value);
        }
    };

    const handleChange_Discount = (event) => {
        let value = event.target.value;
        // ลบคอมม่าและตรวจสอบว่าป้อนเป็นตัวเลขเท่านั้น
        value = value.replace(/,/g, '');
        if (/^[0-9]*$/.test(value)) {
            // จัดรูปแบบตัวเลขใหม่และเพิ่มคอมม่า
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            setDiscount(value);
        }
    };

    const handleChange_Wages = (event) => {
        let value = event.target.value;
        // ลบคอมม่าและตรวจสอบว่าป้อนเป็นตัวเลขเท่านั้น
        value = value.replace(/,/g, '');
        if (/^[0-9]*$/.test(value)) {
            // จัดรูปแบบตัวเลขใหม่และเพิ่มคอมม่า
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            setWages(value);
        }
    };

    const calculateTotal = () => {
        // คำนวณราคาสุทธิ พิจารณาส่วนลดและค่าแรงช่างด้วย
        const totalServices = selectedServices.reduce((total, service) => total + service.unit_price, 0);
        const totalRepairs = repairs.reduce((acc, repair) => acc + repair.cost, 0);
        const cartDetails = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        return totalServices + totalRepairs + cartDetails;
    };

    const addToCart = (item, quantity) => {
        const newItem = { ...item, quantity: Number(quantity) };
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex >= 0) {
            // Update the quantity of the existing item
            const updatedCart = cart.map((cartItem, index) => {
                if (index === existingItemIndex) {
                    return { ...cartItem, quantity: cartItem.quantity + Number(quantity) };
                }
                return cartItem;
            });
            setCart(updatedCart);
        } else {
            // Add the new item to the cart
            setCart([...cart, newItem]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const fetchCustomerDatas = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/fetchAllcustomer`);
            const data = await response.json();
            const filteredData = data.filter(customer => customer.full_name.toLowerCase().includes(query.toLowerCase()));
            setResults(filteredData);
        } catch (error) {
            console.error('Error fetching data: ss', error);
        }
    };

    const fetchCarData = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/fetchAllcar`);
            const data = await response.json();
            const filteredData = data.filter(car =>
                car.registration_id === carquery);
            setcarResults(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const fetchData = () => {
        axios.get(`${VITE_API_URL}/fetchAllWorkforceInformation`)
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    };

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAllpart`);
            const categorizedItems = categorizeItems(response.data);
            setItems(categorizedItems);
            setFilteredItems(categorizedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleSaveClicks = async () => {

        const quotationDate = new Date().toISOString();

        const totalAmountDetails = `${calculateTotal()}`;

        const details = `${selectedServices.map(service => `${service.service_name}`).join(',')}`;
        const data_id = JSON.parse(localStorage.getItem('data_id'));
        console.log(selectedEmployeeId)

        let quotationData = {
            quotation_date: quotationDate,
            total_amount: totalAmountDetails,
            details: details,
            update_record: data_id.full_name
        };
        if (selectedCustomer.id != null) {
            quotationData.customer_id = selectedCustomer.id;
        }


        try {
            // ส่งข้อมูลใบเสนอราคา
            const responseQuotation = await axios.post(`${VITE_API_URL}/Addquotationdata`, quotationData);
            alert('Quotation data saved successfully!');
            // console.log(responseQuotation.data);

            const quotation_id = responseQuotation.data.id; // Assuming the API response includes the id of the newly created quotation

            // Add services data
            console.log()
            await Promise.all(selectedServices.map(service => {
                const serviceData = {
                    service_id: service.id,
                    quotation_id: quotation_id,
                    quantity: 1, // Assuming 1 quantity per service, adjust if necessary
                    line_total: service.unit_price,

                };
                return axios.post(`${VITE_API_URL}/Addquotation_servicedata`, serviceData);
            }));
            alert('All service data added successfully!');

            // หลังจากได้ quotation_id ก็ทำการส่งข้อมูลอะไหล่ทีละรายการ
            await Promise.all(cart.map(async (item) => {
                const partData = {
                    part_id: item.id,
                    quotation_id: quotation_id,
                    quantity: item.quantity,
                    line_total: item.quantity * item.price
                };
                return axios.post(`${VITE_API_URL}/Addquotation_partdata`, partData);
            }));

            alert('All parts data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
        props.setDisplayComponent("Create_Quotation_search")
    };

    useEffect(() => {
        fetchServices();
        fetchData();
        fetchItems();
    }, []);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <div>

                <div className="text-4xl font-bold text-center mb-6">ใบเสนอราคา</div>
                <div className="container mx-auto p-4 max-w-4xl">

                    {/* ////////////car///////////// */}
                    {/* <div className="p-4">
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                placeholder="Search car by registration ID..."
                                value={carquery}
                                onChange={(e) => setcarQuery(e.target.value)}
                                className="input input-bordered w-full max-w-xs"
                            />
                            <button onClick={fetchCarData} className="btn btn-primary">ค้นหา</button>
                        </div>
                        <ul className="list-disc pl-5">
                            {carresults.map(car => (
                                <li key={car.id} className="flex justify-between items-center my-2">
                                    {car.brand} {car.model} - {car.registration_id}
                                    <button onClick={() => handleSelectCar(car)} className="btn btn-secondary btn-xs">เลือก</button>
                                </li>
                            ))}
                        </ul>
                        {selectedCar && (
                            <div className="card compact side bg-base-100 shadow-xl mb-4 p-5">
                                <h2 className="card-title text-2xl mb-4 text-center">รายละเอียดรถ</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div><span className="font-bold">ป้ายทะเบียน:</span> <span className="ml-2">{selectedCar.registration_id || 'N/A'}</span></div>
                                    <div><span className="font-bold">รหัสเจ้าของรถ:</span> <span className="ml-2">{selectedCar.owner_id || 'N/A'}</span></div>
                                    <div><span className="font-bold">ยี่ห้อ:</span> <span className="ml-2">{selectedCar.brand || 'N/A'}</span></div>
                                    <div><span className="font-bold">รุ่น:</span> <span className="ml-2">{selectedCar.model || 'N/A'}</span></div>
                                    <div><span className="font-bold">ปี:</span> <span className="ml-2">{selectedCar.year || 'N/A'}</span></div>
                                    <div><span className="font-bold">สี:</span> <span className="ml-2">{selectedCar.color || 'N/A'}</span></div>
                                </div>
                            </div>
                        )}

                        {customerInfo && (
                            <div className="card compact side bg-base-100 shadow-xl mb-4">
                                <h2 className="card-title">Customer Details</h2>
                                <p>Name: {customerInfo.full_name || 'N/A'}</p>
                                <p>Email: {customerInfo.E_mail || 'N/A'}</p>
                                <p>Phone: {customerInfo.tele_number || 'N/A'}</p>
                                <p>Address: {customerInfo.address || 'N/A'}</p>
                            </div>
                        )}

                    </div> */}

                    <div className="p-4">
                        <div className="input-group mb-2">
                            <input type="text" placeholder="ระบุชื่อลูกค้า ไม่จำเป็นต้องมีคำนำหน้า" value={query} onChange={(e) => setQuery(e.target.value)} className="input input-bordered w-full max-w-xs" />
                            <button onClick={fetchCustomerDatas} className="btn ">ค้นหา</button></div>
                        <ul className="list-disc pl-5">
                            {results.map(customer => (
                                <li key={customer.id} className="flex justify-between items-center my-2">
                                    {customer.full_name}
                                    <button onClick={() => handleSelectCustomer(customer)} className="btn btn-secondary btn-xs">เลือก</button>
                                </li>
                            ))}
                        </ul>
                        {customerInfo && (
                            <div className="card compact side bg-base-100 shadow-xl mb-4 p-5">
                                <div className="card-body">
                                    <h2 className="card-title text-2xl mb-4">ข้อมูลของลูกค้า</h2>
                                    <div className="flex flex-wrap justify-between text-base">
                                        <div className="flex-1 min-w-[50%]"><span className="font-bold">ชื่อ:</span> {customerInfo.full_name || 'N/A'}</div>
                                        <div className="flex-1 min-w-[50%]"><span className="font-bold">อีเมลล์:</span> {customerInfo.e_mail || 'N/A'}</div>
                                        <div className="flex-1 min-w-[50%]"><span className="font-bold">เบอร์โทร:</span> {customerInfo.tele_number || 'N/A'}</div>
                                        <div className="flex-1 min-w-[50%]"><span className="font-bold">ที่อยู่:</span> {customerInfo.address || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedCustomer && (
                            <div className="card bg-base-100 shadow-xl p-4">
                                <h2 className="card-title">รายละเอียด ลูกค้า</h2>
                                <p>ชื่อ-สกุล: {selectedCustomer.full_name || 'N/A'}</p>
                                <p>อีเมลล์: {selectedCustomer.e_mail || 'N/A'}</p>
                                <p>เบอร์โทร: {selectedCustomer.tele_number || 'N/A'}</p>
                                <p>ที่อยู่: {selectedCustomer.address || 'N/A'}</p>
                                <p>รายละเอียด: {selectedCustomer.detail || 'N/A'}</p>
                            </div>
                        )}
                    </div>
                    {/* </div> */}

                    {/* //////////////////////-------------------------------------///////////////////////////// */}
                    <div >
                        <h1>โปรดระบุบริการซ่อม</h1>
                        <div className="form-search mb-4 bg-base-100 shadow-xl rounded-lg p-4">
                            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4 sm:flex-row">
                                <input
                                    type="text"
                                    placeholder="โปรดใส่ชื่อบริการที่ท่านต้องการจะเพิ่ม"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="input input-bordered flex-grow"
                                />
                            </form>
                        </div>

                        {searchResults.length > 0 && (
                            <ul className="list-none p-0">
                                {searchResults.map((service) => (
                                    <li key={service.id} className="flex justify-between items-center my-2">
                                        <span>{service.service_name} - {service.unit_price} - {service.description}</span>
                                        <button
                                            onClick={() => handleSelectService(service)}
                                            className={`btn btn-sm ${selectedServices.find(s => s.id === service.id) ? 'btn-error' : 'btn-success'} mx-2`}>
                                            {selectedServices.find(s => s.id === service.id) ? 'ยกเลิก' : 'เลือก'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {selectedServices.length > 0 && (
                            <div className="selected-services my-4 bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-2 bg-blue-600 text-white">
                                    <h2 className="text-xl font-semibold">บริการ:</h2>
                                </div>
                                <ul className="list-none p-2 bg-gray-100">
                                    {selectedServices.map((service) => (
                                        <li key={service.id} className="border-b border-gray-200 p-2 flex justify-between items-center">
                                            <span className="text-gray-600 text-sm ">{service.service_name}</span>
                                            <span className="text-gray-500 text-sm ">{service.unit_price} บาท</span>
                                            <span className="text-gray-500 text-sm">{service.description}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-2 bg-gray-200 text-right">
                                    <h3 className="text-lg font-semibold">รวม: <span className="text-gray-800">{totalAmount}</span> บาท</h3>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
                {/* ////////////////////////////cart>>>>>//////////////////////////// */}
                <div className="flex min-h-screen">
                    <div className="sidebar bg-gray-00 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
                        <div className="sticky top-0 bg-gray-900 space-y-9 py-7 px-2 h-3/4 overflow-auto">
                            <h2 className="text-xl font-bold mb-2">หมวดหมู่</h2>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        className="text-white hover:text-gray-200"
                                        onClick={() => setCategory('all')}
                                    >
                                        หมวดหมู่ทั้งหมด
                                    </button>
                                </li>
                                {Object.keys(items).map((cat) => (
                                    <li key={cat}>
                                        <button
                                            className="text-white hover:text-gray-200"
                                            onClick={() => setCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ div>
                    <div className="container mx-auto my-8 max-w-4xl max-h-160">
                        <h1 className="text-3xl font-bold mb-4">คลังเก็บของ</h1>
                        <form onSubmit={handleSearchCart} className="mb-4">
                            <div className="form-control">
                                <div className="input-group">
                                    <select className="select select-bordered w-full max-w-xs" value={category} onChange={handleCategoryChange}>
                                        <option value="all">หมวดหมู่ทั้งหมด</option>
                                        {Object.keys(items).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={searchTerms}
                                        onChange={(e) => setSearchTerms(e.target.value)}
                                        placeholder="กรุณาใส่ชื่อสินค้า"
                                        className="input input-bordered"
                                    />
                                    <button type="submit" className="btn btn-primary">ค้นหา</button>
                                </div>
                            </div>
                        </form>
                        <div>
                            {Object.keys(filteredItems).map(cat => (
                                // ตรวจสอบก่อนว่ามีสินค้าในหมวดหมู่นี้หรือไม่
                                filteredItems[cat].length > 0 && (
                                    <div key={cat} className="mb-4">
                                        <h2 className="text-2xl font-bold flex-grow text-blue-500">{cat}</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {filteredItems[cat].map(item => (
                                                <div key={item.id} className="card bg-base-100 shadow-xl w-30 h-auto">
                                                    <div className="card-body">
                                                        <h3 className="card-title">{item.name}</h3>
                                                        <p>Price: ${item.price}</p>
                                                        <div className="card-actions justify-end">
                                                            <input type="number" min="1" defaultValue="1" className="input input-bordered input-sm w-20" id={`quantity-${item.id}`} />
                                                            <button onClick={() => addToCart(item, document.getElementById(`quantity-${item.id}`).value)} className="btn btn-primary">เพิ่ม</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                        <div className="my-8">
                            <h2 className="text-2xl font-bold mb-4">รายการวัสดุ</h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>ชื่อ</th>
                                            <th>จำนวน</th>
                                            <th>ราคา</th>
                                            <th>ราคารวม</th>
                                            <th>ดำเนินการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price.toFixed(2)}</td>
                                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <button className="btn btn-error btn-sm" onClick={() => removeFromCart(item.id)}>เอาออก</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <h3 className="text-xl font-bold mt-4">รวม: ${calculateTotal().toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            <div className=""> 
     <div className="flex items-center justify-center space-x-2 mt-4">
    <div className="stat">
    <div className="flex items-center justify-center space-x-2">
        <div className="total">คำนวณราคาซ่อม <br></br>
            <h3 className="stat-value">ราคาสุทธิ: {calculateTotal().toLocaleString()} บาท</h3>
        
            <button className="btn btn-info px-5 py-5 m-2" onClick={handleSaveClicks}>สร้างเสนอราคา</button>
            <button className="btn btn-error px-5 py-5 m-2" onClick={() => props.setDisplayComponent("Create_Quotation_search")}>ยกเลิก</button>

        </div>
    </div>
    </div>
</div>

        </div>
                    </div>

        </>

    );
}