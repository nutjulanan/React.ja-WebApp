import axios from 'axios';
import React, { useEffect, useState } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // นำเข้า vfs_fonts ตามปกติ
import angsaFontBase64 from '/font/angsa.js';
import angsabBase64 from '/font/angsab.js';
import angsaiBase64 from '/font/angsai.js';
import angsananewbolditalicBase64 from '/font/angsananewbolditalic.js';

import Selectbill from './selectbill'
import Editbill from './editbill'

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { format } from "date-fns";

// อัพเดท vfs โดยใช้การกำหนดค่าเดียว
pdfMake.vfs = {
    ...pdfFonts.pdfMake.vfs,
    "THSarabunNew.ttf": angsaFontBase64,
    "THSarabunNew-Bold.ttf": angsabBase64,
    "THSarabunNew-Italic.ttf": angsaiBase64,
    "THSarabunNew-BoldItalic.ttf": angsananewbolditalicBase64
};

pdfMake.fonts = {
    THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew-Bold.ttf',
        italics: 'THSarabunNew-Italic.ttf',
        bolditalics: 'THSarabunNew-BoldItalic.ttf'
    }
};


export default function writepdfbill(props) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [displayComponent, setDisplayComponent] = useState("Selectbill");

    const [selectedItems, setSelectedItems] = useState([]);

    const [quotation, setQuotation] = useState(null);
    const [quotationData, setQuotationData] = useState(null);

    const [billQuotations, setBillQuotations] = useState([]);
    const [bill, setBill] = useState(null);

    const [file, setFile] = useState(null);
    const [pictureUrl, setPictureUrl] = useState('');
    const [pictureImg, setPictureImg] = useState(null);

    const [quotationParts, setQuotationParts] = useState([]);
    const [quotationServices, setQuotationServices] = useState([]);

    const [database_set, setDatabase_set] = useState([...quotationParts, ...quotationServices]);

    const [customerData, setCustomerData] = useState(null);
    const [BillDate, setBillDate] = useState({
        dd: '',
        MM: '',
        yyyy: ''
    });

    const [garage, setGarage] = useState(null);

    const [formData, setFormData] = useState({
        job_id: '',
        customer_id: '2',
        item_details: '',
        tax_amount: '',
        discount_amount: '',
        total_amount: '',
        payment_method: '',
        payment_status: '',
        bill_date: '',
        update_record: '',
    });

    const [error, setError] = useState('');

    const [data, setData] = useState([])
    const [records, setRecords] = useState(data)

    const [billdata, setbillData] = useState([])
    const [billrecords, setbillRecords] = useState(data)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const fetchQuotationPartsByQuotationId = async (quotationId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/quotation_parts/${quotationId}`);


            let updatedData = [];
            const result = response.data;
            setQuotation(quotationId.id);

            console.log("api part")

            for (const item of result) {
                // const response = await axios.get(`${VITE_API_URL}/work_roles_permissions/${item.id}`);
                const response = await axios.get(`${VITE_API_URL}/fetchAllpartById/${item.part_id}`);

                updatedData.push({
                    ...item,
                    name_info: response.data.name,
                    unit_price: response.data.price
                });
            }



            // setQuotationParts(updatedData);
            return updatedData

        } catch (error) {
            setError('Failed to fetch quotation parts');
            console.error('Error:', error);
            let updatedData = [];
            return updatedData
        }
    };

    const fetchQuotationServicesByQuotationId = async (quotationId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/quotation_services/${quotationId}`);
            let updatedData = [];
            const result = response.data;

            for (const item of result) {
                // const response = await axios.get(`${VITE_API_URL}/work_roles_permissions/${item.id}`);
                const response = await axios.get(`${VITE_API_URL}/fetchAllserviceById/${item.service_id}`);
                updatedData.push({
                    ...item,
                    name_info: response.data.service_name,
                    unit_price: response.data.unit_price
                });
            }


            // setQuotationServices(updatedData);
            return updatedData
        } catch (error) {
            setError('Failed to fetch quotation services');
            console.error('Error:', error);
            let updatedData = [];
            return updatedData
        }
    };

    const fetchCustomerById = async (id) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAllcustomerById/${id}`);
            setCustomerData(response.data);

        } catch (err) {
            setError('Error fetching customer data');
            console.error('Error fetching customer data by ID:', err);
        }
    };

    const fetchGarageDetails = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/garage/${1}`);
            setGarage(response.data);
        } catch {
            console.error('Error :', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchBillQuotation = async (billId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/bill_quotation/bill/${billId}`);
            const res = response.data;

            let data = [];
            for (const item of res) {
                try {
                    const response = await axios.get(`${VITE_API_URL}/fetchAllquotationById/${item.quotation_id}`);
                    data.push({
                        ...response.data,
                    });
                } catch (error) {
                    console.error('There was an error fetching the bill-quotation relationships:', error);
                    setError('Failed to fetch bill-quotation data');
                }
            }

            setBillQuotations(data);



        } catch (error) {
            console.error('There was an error fetching the bill-quotation relationships:', error);
            setError('Failed to fetch bill-quotation data');
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const fetchBillPicture = async (billId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/bills/${billId}/picture`, { responseType: 'blob' });
            setPictureUrl(URL.createObjectURL(response.data));
            setPictureImg(response.data);
        } catch (error) {
            setPictureUrl('');
            console.error('There was an error fetching the bills picture!', error);

        }
    };

    const fetchAPI = async () => {
        const res = await axios.get(`${VITE_API_URL}/quotations/${props.currentJob.id}`)

        const result = res.data;
        let updatedData = [];
        for (const item of result) {
            const response_name = await axios.get(`${VITE_API_URL}/fetchAllcustomerById/${item.customer_id}`);

            updatedData.push({
                ...item,
                full_name: response_name.data.full_name // เพิ่มข้อมูลใหม่ที่คุณต้องการ
            });
        }

        setData(updatedData)
        setRecords(updatedData)

        const billres = await axios.get(`${VITE_API_URL}/bills/job/${props.currentJob.id}`)

        const bill = billres.data;
        let updatedbillData = [];
        for (const item of bill) {
            const response_name = await axios.get(`${VITE_API_URL}/fetchAllcustomerById/${item.customer_id}`);

            updatedbillData.push({
                ...item,
                full_name: response_name.data.full_name // เพิ่มข้อมูลใหม่ที่คุณต้องการ
            });
        }
        setbillData(updatedbillData)
        setbillRecords(updatedbillData)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function getMonthName(monthNumber) {
        // Convert monthNumber to a number in case it's a string, especially with leading zero
        const monthIndex = parseInt(monthNumber, 10);

        const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

        if (monthIndex >= 1 && monthIndex <= 12) {
            return months[monthIndex - 1];
        } else {
            return 'Invalid month number';
        }
    }

    function convertADtoBE(adYear) {
        // Convert the input to a number in case it's a string
        const numericYear = parseInt(adYear, 10);

        // Check if the conversion was successful
        if (isNaN(numericYear)) {
            return 'Invalid year';
        }

        return numericYear + 543;
    }



    // คำนวณรวมเงิน
    const totalPrice = database_set.reduce((acc, item) => acc + item.line_total, 0);

    // สร้างแถวข้อมูลจาก database_set
    const tableBody = database_set.map(item => {
        const idText = item.service_id ? 'S' + item.service_id : 'P' + item.part_id;
        return [
            { text: item.quotation_id, style: 'tableText', alignment: 'center' },
            { text: idText, style: 'tableText', alignment: 'center' },
            { text: item.name_info, style: 'tableText' }, // You may want to differentiate what you display here for parts and services
            { text: item.quantity, style: 'tableText' },
            { text: item.unit_price, style: 'tableText' },
            { text: item.line_total, style: 'tableText' },
        ];
    });

    // เพิ่มส่วนหัวของตารางและแถวสำหรับรวมเงิน
    tableBody.unshift([{ text: 'Q No.', style: 'tableHeader' }, { text: 'No.', style: 'tableHeader' }, { text: 'รายการ', style: 'tableHeader' }, { text: 'จำนวน', style: 'tableHeader' }, { text: 'ราคา', style: 'tableHeader' }, { text: 'จำนวนเงิน', style: 'tableHeader' }]);
    tableBody.push(['', '', '', '', { text: 'รวมเงิน', style: 'tableHeader' }, { text: totalPrice + '  บาท', style: 'tableText' }]);


    const [isSelectReady, setisSelectReady] = useState(false);
    const [isPDFReady, setisPDFReady] = useState(false);
    const [isReady, setisReady] = useState(false);


    const createpdf_QuotationId = async (quotationId) => {

        setisReady(false); // Reset to false every time a new quotationId is processed


        setQuotationData(quotationId);

        let updatedPart = [];
        for (const item of quotationId) {
            const part = await fetchQuotationPartsByQuotationId(item.id);
            // setQuotation(item);
            for (const i of part) {
                updatedPart.push({
                    ...i,
                });
            }
        }
        setQuotationParts(updatedPart);

        let updatedService = [];
        for (const item of quotationId) {
            const service = await fetchQuotationServicesByQuotationId(item.id);

            for (const i of service) {
                updatedService.push({
                    ...i,
                });
            }

        }
        setQuotationServices(updatedService);


        setDatabase_set([...quotationParts, ...quotationServices]);


        setisReady(true);
        console.log("/////////////////////////////////////")
    };

    const select_bill = async (billId) => {
        setisSelectReady(false);
        setBill(billId)
        await fetchBillQuotation(billId.id)
        setisSelectReady(true);
    }

    const createpdf_BillId = async () => {
        setisSelectReady(false);
        setisPDFReady(false);

        let updatedPart = [];
        for (const item of billQuotations) {
            const part = await fetchQuotationPartsByQuotationId(item.id);
            // setQuotation(item);
            for (const i of part) {
                updatedPart.push({
                    ...i,
                });
            }
        }
        setQuotationParts(updatedPart);

        let updatedService = [];
        for (const item of billQuotations) {
            const service = await fetchQuotationServicesByQuotationId(item.id);

            for (const i of service) {
                updatedService.push({
                    ...i,
                });
            }

        }
        setQuotationServices(updatedService);
        setDatabase_set([...quotationParts, ...quotationServices]);


        BillDate.dd = format(new Date(bill.bill_date), "dd");
        BillDate.MM = getMonthName(format(new Date(bill.bill_date), "MM"));
        BillDate.yyyy = convertADtoBE(format(new Date(bill.bill_date), "yyyy"));

        await fetchCustomerById(bill.customer_id);
        await fetchBillPicture(bill.id);
        console.log("/////////////////////////////////////")
        setisPDFReady(true);
    }


    useEffect(() => {
        setDatabase_set([...quotationParts, ...quotationServices]);
        setDatabase_set(currentData => currentData.sort((a, b) => a.quotation_id - b.quotation_id));
    }, [quotationParts, quotationServices]);

    useEffect(() => {
        fetchGarageDetails();
    }, []);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const exportPDF = () => {


        const documentDefinition = {
            content: [
                {
                    text: 'BILL No.' + bill.id,
                    style: 'header',
                    alignment: 'right',
                    fontSize: 14
                },
                {
                    text: 'JOB No.' + bill.job_id,
                    style: 'header',
                    alignment: 'right',
                    fontSize: 14
                },
                {
                    text: 'บิลชำระเงิน',
                    style: 'header',
                    alignment: 'center',
                    fontSize: 30,
                    bold: true,
                    margin: [0, 20, 0, 20]

                },





                {
                    text: [
                        { text: garage.garage_name + '\n', fontSize: 20, alignment: 'center', bold: true },
                        { text: garage.address, fontSize: 16, alignment: 'center' },
                        { text: 'โทร. ' + garage.telephone_number, fontSize: 16, alignment: 'center' },
                        { text: '\n' + garage.detail_garages, fontSize: 16, alignment: 'center' },
                        { text: '\n เลขประจำตัวผู้เสียภาษีอากร ' + garage.tin, fontSize: 16, alignment: 'center' },
                    ]
                },
                {
                    text: [
                        { text: 'นาม ', fontSize: 16, alignment: 'left' },
                        { text: customerData.nameprefix + ' ' + customerData.full_name, fontSize: 16, bold: true },
                        // { text: 'Address.......................................' },
                        { text: '\nวันที่ ' + BillDate.dd + ' เดือน ' + BillDate.MM + ' พ.ศ. ' + BillDate.yyyy + '\n', fontSize: 16 },
                        { text: 'ที่อยู่ ' + customerData.address, fontSize: 16 },
                    ], margin: [0, 10, 0, 10]
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [30, 40, 280, 'auto', 'auto', 'auto'],
                        heights: 'auto', // ตั้งค่า heights เป็น 'auto' เพื่อให้ความสูงปรับตามเนื้อหา
                        body: tableBody, // ใช้ tableBody ที่เราสร้างขึ้น
                    },



                },
                {
                    alignment: 'justify',
                    columns: [

                        {
                            text: [], margin: [0, 40, 0, 10]
                        },
                        {
                            text: [
                                { text: 'ลงชื่อ(.................................................................)', fontSize: 16, alignment: 'center', bold: true },
                                { text: '\nผู้ให้บริการ', fontSize: 16, alignment: 'center' },
                            ], margin: [0, 40, 0, 10]
                        },
                    ]
                },
                {
                    alignment: 'justify',
                    columns: [
                        {
                            stack: [
                                { text: 'หมายเหตุ...................................................................................................................................................................................................' },
                            ],
                            style: 'detail'
                        }]
                },




            ], styles: {
                info: {
                    fontSize: 16,

                    alignment: 'left',
                    margin: [0, 20, 0, 30]
                },

                Customer: {
                    fontSize: 16,

                    alignment: 'left',
                    margin: [0, 25, 0, 0]
                },

                price: {
                    fontSize: 14,

                    alignment: 'right',
                    margin: [0, 30, 0, 0]
                },

                signature: {
                    fontSize: 14,

                    alignment: 'center',
                    margin: [0, 0, 0, 0]
                },

                detail: {
                    fontSize: 14,

                    alignment: 'center',
                    margin: [0, 20, 0, 0]
                },

                tableHeader: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 0]
                },

                tableText: {
                    fontSize: 14,
                    alignment: 'left',
                    margin: [0, 0, 0, 0]
                }

            },
            defaultStyle: {
                font: 'THSarabunNew'
            }
        };
        pdfMake.createPdf(documentDefinition).open();
        // pdfMake.createPdf(documentDefinition).print();
        setisPDFReady(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        const data_id = JSON.parse(localStorage.getItem('data_id'));

        const dataToSubmit = {
            ...formData,
            job_id: parseInt(props.currentJob.id, 10),
            customer_id: parseInt(formData.customer_id, 10),
            tax_amount: parseInt(formData.tax_amount, 10),
            discount_amount: parseInt(formData.discount_amount, 10),
            total_amount: parseInt(totalPrice, 10),
            bill_date: formData.bill_date,
            update_record: data_id.full_name
        };
        console.log(dataToSubmit.bill_date);
        try {
            const response = await axios.post(`${VITE_API_URL}/Addbilldata`, dataToSubmit);
            console.log('Bill added successfully:', response.data);
            // console.log(quotationData)
            for (const item of quotationData) {
                const dataSubmit = {
                    bill_id: response.data.id,
                    quotation_id: item.id,
                };

                try {
                    const response = await axios.post(`${VITE_API_URL}/bill_quotation`, dataSubmit);
                    console.log('Bill-Quotation relationship added successfully:', response.data);
                    // Handle success here (e.g., showing a success message)
                } catch (error) {
                    console.error('There was an error posting the bill-quotation data:', error);
                    // Handle error here (e.g., showing an error message)
                }
            }
            // Handle success (e.g., clear form, show success message)
        } catch (error) {
            console.error('There was an error posting the bill data:', error);
            // Handle error (e.g., show error message)
        }
        setSelectedItems([]);
        setQuotationParts([]);
        setQuotationServices([]);
        setDatabase_set([...quotationParts, ...quotationServices]);
        setisReady(false);
        fetchAPI();
    };

    const Save_img = async () => {

        if (!file || !bill.id) {
            alert('Please select a file and enter a bills ID.');
            return;
        }

        const formData = new FormData();
        formData.append('picture', file);

        try {
            const response = await axios.put(`${VITE_API_URL}/bills/${bill.id}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchBillPicture(bill.id);
            alert('Picture updated successfully');
            console.log(response.data);
        } catch (error) {
            console.error('Error updating bills picture:', error);
            alert('Failed to update picture');
        }

    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <>
                <button onClick={() => { props.setDisplayComponent("JobsTable_search"); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 w-60 rounded mr-2">กลับไปหน้ารายการซ่อม</button><br></br>
                <div>
                    {displayComponent === "Selectbill" && <Selectbill fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} data={data} createpdf_QuotationId={createpdf_QuotationId} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />}

                    {/* <div className="label">  {quotationParts ? (<span className="label-text">{"quotationParts  " + quotationParts}</span>) : (<span className="label-text">ไม่มีข้อมูล</span>)} </div>
                    <div className="label">  {quotationServices ? (<span className="label-text">{"quotationServices    " + quotationServices}</span>) : (<span className="label-text">ไม่มีข้อมูล</span>)} </div>
                    <div className="label">  {database_set ? (<span className="label-text">{"database_set  " + database_set}</span>) : (<span className="label-text">ไม่มีข้อมูล</span>)} </div> */}

                    {/* <button onClick={() => test()} className="btn btn-error m-2">Test</button> */}
                </div>
                <form onSubmit={handleSubmit}>
                    <br></br><br></br><h2>ระบุช่องทางการชำระเงิน</h2><br></br>
                    <select name="payment_method" value={formData.payment_method} onChange={handleChange} required>
                        <option value="">เลือก</option>
                        <option value="cash">เงินสด</option>
                        <option value="card">บัตรเงินสด</option>
                        <option value="online">ออนไลน์</option>
                    </select><br></br><br></br>

                    <br></br><br></br><h2>สถานะการชำระ</h2><br></br>
                    <select name="payment_status" value={formData.payment_status} onChange={handleChange} required>
                        <option value="">เลือก</option>
                        <option value="ชำระเรียบร้อย">ชำระเรียบร้อย</option>
                        <option value="ยังไม่ดำเนินการชำระ">ยังไม่ดำเนินการชำระ</option>
                    </select><br></br><br></br>

                    <h2>วันที่</h2><br></br>
                    <input name="bill_date" type="date" value={formData.bill_date} onChange={handleChange} placeholder="bill_date" required /><br></br><br></br><br></br>
                    <button type="submit" disabled={!isReady} className="btn btn-outline btn-success">เพิ่มบิล</button>
                </form>

                <div>{displayComponent === "Selectbill" && <Editbill fetchAPI={fetchAPI} isPDFReady={isPDFReady} setDisplayComponent={setDisplayComponent} records={billrecords} data={billdata} select_bill={select_bill} setisPDFReady={setisPDFReady} />}</div>
                <div className="label">  {quotation ? (<span className="label-text">{"เอกสารที่เลือกคือหมายเลข " + quotation.id}</span>) : (<span className="label-text">โปรดเลือกเอกสารที่ต้องการ</span>)} </div>
                <button onClick={() => createpdf_BillId()} disabled={!isSelectReady} className="btn btn-accent m-2">ยืนยันการเลือกเอกสาร</button>
                <button onClick={() => exportPDF()} disabled={!isPDFReady} className="btn btn-warning">สร้างเอกสาร</button>

                <button onClick={() => Save_img()} disabled={!isPDFReady} className="btn btn-primary m-2">บันทึกภาพ</button>
                {/* <br></br> <br></br><button className="btn btn-error m-2" disabled={!isPDFReady} onClick={() => deleteWorkforceInformation(element.id)}>ลบข้อมูล </button> */}
                <div>  <label htmlFor="picture">เลือกไฟล์รูปภาพที่ท่านต้องการบันทึก:</label>  <input type="file" id="picture" onChange={handleFileChange} /> </div>
                <div> <h2>ภาพเอกสาร</h2> {pictureUrl ? (<img src={pictureUrl} alt="Car Quotation" style={{ maxWidth: '100%' }} />) : (<p>ยังไม่ได้เลือกภาพ หรือ ไม่มีรูปภาพ</p>)} </div>
            </>
        </>
    );
}
