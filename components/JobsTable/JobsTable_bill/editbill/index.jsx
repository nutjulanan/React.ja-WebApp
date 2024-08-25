import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function selectbill(props) {
    const [selectedItems, setSelectedItems] = useState([]);

    const deleteWorkforceInformation = async (id) => {
        try {
            const response = await axios.delete(`${VITE_API_URL}/deletebill/${id}`);
            console.log('Data deleted successfully:', response.data);
            props.fetchAPI()
        } catch (error) {
            if (error.response) {
                console.error('Data not found or already deleted', error.response.data);
            } else if (error.request) {
                console.error('No response was received', error.request);
            } else {
                console.error('Error', error.message);
            }
        }
    };

    //   const editWorkforceInformation = async (element) => {
    //     props.setNewWorkforceInformation({
    //       id: element.id,
    //       national_id: element.national_id,
    //       nameprefix: element.nameprefix,
    //       full_name: element.full_name,
    //       age: element.age,
    //       sex: element.sex,
    //       email: element.email,
    //       telephone_number: element.telephone_number,
    //       secondarycontact: element.secondarycontact,
    //       address: element.address,
    //       jobexperience: element.jobexperience,
    //       salary: element.salary,
    //       totalvacationdays: element.totalvacationdays,
    //       start_work_date: element.start_work_date,
    //       end_of_work_day: element.end_of_work_day
    //     });
    //   };


    useEffect(() => {
        props.fetchAPI()
    }, [])

    const handleSelectionChange = (selected, id) => {
        if (selected) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(item => item !== id));
        }
    };

    return (
        <>
            <br></br>


            <table className='table table-xs'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>JOB NO.</th>
                        <th>ชื่อลูกค้า</th>
                        <th>จำนวนเงิน</th>
                        <th>ช่องทางการชำระเงิน</th>
                        <th>สถานะการชำระ</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        props.records.map((element, index) => (
                            <tr key={index}>
                                <td>{element.id}</td>
                                <td>{element.job_id}</td>
                                <td>{element.full_name}</td>
                                <td>{element.total_amount}</td>
                                <td>{element.payment_method}</td>
                                <td>{element.payment_status}</td>
                                {/* <td> <button  className="btn btn-error m-2" onClick={() => { editWorkforceInformation(element); props.setDisplayComponent("Employee_edit");  }} > แก้ไข </button> </td> */}

                                {/* <td><input type="checkbox" onChange={(e) => handleSelectionChange(e.target.checked, element)} checked={selectedItems.includes(element)} /></td> */}
                                <td><button onClick={() => { props.select_bill(element); }} className="btn btn-outline btn-accent"> เลือกเอกสารนี้ </button></td>

                                <td><button className="btn btn-error m-2" onClick={() => { if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) { deleteWorkforceInformation(element.id); } }}>ลบข้อมูล </button></td> </tr>
                        ))
                    }
                </tbody>
            </table>
            {/* <button onClick={() => props.createpdf_QuotationId(selectedItems)} className="btn btn-error m-2" disabled={selectedItems.length === 0}> ยืนยัน </button> */}



        </>
    );
}
