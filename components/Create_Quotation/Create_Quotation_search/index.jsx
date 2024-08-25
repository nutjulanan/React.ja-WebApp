import axios from 'axios';
import React, { useEffect, useState } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // นำเข้า vfs_fonts ตามปกติ
import angsaFontBase64 from '/font/angsa.js';
import angsabBase64 from '/font/angsab.js';
import angsaiBase64 from '/font/angsai.js';
import angsananewbolditalicBase64 from '/font/angsananewbolditalic.js';

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

const VITE_API_URL = import.meta.env.VITE_API_URL;
import { format } from "date-fns";

export default function Create_Quotation_search(props) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [isPdfReady, setIsPdfReady] = useState(false);

    const [quotation, setQuotation] = useState(null);
    const [quotationParts, setQuotationParts] = useState([]);
    const [quotationServices, setQuotationServices] = useState([]);

    const [database_set, setDatabase_set] = useState([...quotationParts, ...quotationServices]);

    const [QuotationDate, setQuotationDate] = useState({
        dd: '',
        MM: '',
        yyyy: ''
    });

    const [customerData, setCustomerData] = useState(null);
    const [garage, setGarage] = useState(null);

    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const [pictureUrl, setPictureUrl] = useState('');
    const [pictureImg, setPictureImg] = useState(null);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchGarageDetails = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/garage/${1}`);
            setGarage(response.data);
        } catch {
            console.error('Error :', error);
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

    const fetchQuotationPartsByQuotationId = async (quotationId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/quotation_parts/${quotationId}`);


            let updatedData = [];
            const result = response.data;

            for (const item of result) {
                // const response = await axios.get(`${VITE_API_URL}/work_roles_permissions/${item.id}`);
                const response = await axios.get(`${VITE_API_URL}/fetchAllpartById/${item.part_id}`);

                updatedData.push({
                    ...item,
                    name_info: response.data.name,
                    unit_price: response.data.price
                });
            }



            setQuotationParts(updatedData);
        } catch (error) {
            setError('Failed to fetch quotation parts');
            console.error('Error:', error);
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


            setQuotationServices(updatedData);

        } catch (error) {
            setError('Failed to fetch quotation services');
            console.error('Error:', error);
        }
    };

    const fetchQuotationPicture = async (quotationsId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/quotations/${quotationsId}/picture`, { responseType: 'blob' });
            setPictureUrl(URL.createObjectURL(response.data));
            setPictureImg(response.data);
        } catch (error) {
            setPictureUrl('');
            console.error('There was an error fetching the quotations picture!', error);

        }
    };

    const createpdf_QuotationId = async (quotationId) => {
        setIsPdfReady(false); // Reset to false every time a new quotationId is processed
        setQuotation(quotationId);
        QuotationDate.dd = format(new Date(quotationId.quotation_date), "dd");
        QuotationDate.MM = getMonthName(format(new Date(quotationId.quotation_date), "MM"));
        QuotationDate.yyyy = convertADtoBE(format(new Date(quotationId.quotation_date), "yyyy"));
        if (quotationId.customer_id != null) {
            await fetchCustomerById(quotationId.customer_id);
        }

        await fetchQuotationPartsByQuotationId(quotationId.id);
        await fetchQuotationServicesByQuotationId(quotationId.id);



        setDatabase_set([...quotationParts, ...quotationServices]);

        // Set isPdfReady to true here, indicating all data has been fetched and processed
        setIsPdfReady(true);

        await fetchQuotationPicture(quotationId.id);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // คำนวณรวมเงิน
    const totalPrice = database_set.reduce((acc, item) => acc + item.line_total, 0);


    // สร้างแถวข้อมูลจาก database_set
    const tableBody = database_set.map(item => {
        const idText = item.service_id ? "S" + item.service_id.toString() : "P" + item.part_id.toString();
        return [
            { text: idText, style: 'tableText' },
            { text: item.name_info, style: 'tableText' }, // You may want to differentiate what you display here for parts and services
            { text: item.quantity.toString(), style: 'tableText' },
            { text: item.unit_price.toString(), style: 'tableText' },
            { text: item.line_total.toString(), style: 'tableText' },
        ];
    });

    // เพิ่มส่วนหัวของตารางและแถวสำหรับรวมเงิน
    tableBody.unshift([{ text: 'No.', style: 'tableHeader' }, { text: 'รายการ', style: 'tableHeader' }, { text: 'จำนวน', style: 'tableHeader' }, { text: 'ราคา', style: 'tableHeader' }, { text: 'จำนวนเงิน', style: 'tableHeader' }]);
    tableBody.push(['', '', '', { text: 'รวมเงิน', style: 'tableHeader' }, { text: totalPrice.toString() + '  บาท', style: 'tableText' }]);

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

    const deleteCreate_Quotation = async (id) => {
        try {
            const response = await axios.delete(`${VITE_API_URL}/deletequotation/${id}`);
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

    const editCreate_Quotation = async (element) => {
        props.setNewQuotation({
            id: element.id,
            customer_id: element.customer_id,
            job_id: element.job_id,
            quotation_date: format(new Date(element.quotation_date), "yyyy-MM-dd"),
            details: element.details

        });
    };

    const Save_img = async () => {

        if (!file || !quotation.id) {
            alert('Please select a file and enter a quotations ID.');
            return;
        }

        const formData = new FormData();
        formData.append('picture', file);

        try {
            const response = await axios.put(`${VITE_API_URL}/quotations/${quotation.id}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchQuotationPicture(quotation.id);
            alert('Picture updated successfully');
            console.log(response.data);
        } catch (error) {
            console.error('Error updating quotations picture:', error);
            alert('Failed to update picture');
        }

    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    useEffect(() => {
        setDatabase_set([...quotationParts, ...quotationServices]);
    }, [quotationParts, quotationServices]);

    useEffect(() => {
        props.fetchAPI()
        fetchGarageDetails();
    }, [])

    const SearchData = (e) => {
        const filter = props.data.filter(element =>

            format(new Date(element.quotation_date), "dd-MM-yyyy").includes(e.target.value) ||
            element.update_record.toLowerCase().includes(e.target.value)
        )
        props.setRecords(filter)
    }

    const exportPDF = () => {
        const documentDefinition = {
            content: [
                {
                    text: 'Quotation No.' + quotation.id,
                    style: 'header',
                    alignment: 'right',
                    fontSize: 14
                },
                {
                    text: 'JOB No.' + (quotation.job_id ? quotation.job_id : '-'),
                    style: 'header',
                    alignment: 'right',
                    fontSize: 14
                },
                {
                    text: 'ใบเสนอราคา',
                    style: 'header',
                    alignment: 'center',
                    fontSize: 30,
                    bold: true,
                    margin: [0, 20, 0, 20]

                },



                {
                    alignment: 'justify',
                    columns: [

                        {
                            text: [
                                { text: 'เสนอ ', fontSize: 16 },
                                { text: customerData ? (customerData.nameprefix + ' ' + customerData.full_name) : '...........................................', fontSize: 16, bold: true },
                                { text: '\nวันที่ ' + QuotationDate.dd + ' เดือน ' + QuotationDate.MM + ' พ.ศ. ' + QuotationDate.yyyy + '\n', fontSize: 16 },
                                { text: 'เรื่อง ' + quotation.details, fontSize: 16 },
                            ], margin: [0, 10, 0, 10]
                        },
                        {
                            text: [
                                { text: garage.garage_name + '\n', fontSize: 20, alignment: 'right', bold: true },
                                { text: garage.address, fontSize: 16, alignment: 'right' },
                                { text: 'โทร. ' + garage.telephone_number, fontSize: 16, alignment: 'right' },
                                { text: '\n' + garage.detail_garages, fontSize: 16, alignment: 'right' },
                                { text: '\n เลขประจำตัวผู้เสียภาษีอากร ' + garage.tin, fontSize: 16, alignment: 'right' },
                            ]
                        },
                    ]
                },

                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['auto', 340, 'auto', 'auto', 'auto'],
                        heights: 'auto', // ตั้งค่า heights เป็น 'auto' เพื่อให้ความสูงปรับตามเนื้อหา
                        body: tableBody, // ใช้ tableBody ที่เราสร้างขึ้น
                    }, margin: [0, 30, 0, 0]



                },
                {
                    alignment: 'justify',
                    columns: [

                        {
                            text: [
                                { text: 'ลงชื่อ(.................................................................)', fontSize: 16, alignment: 'center', bold: true },
                                { text: '\nผู้ใช้บริการ', fontSize: 16, alignment: 'center' },
                            ], margin: [0, 40, 0, 10]
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
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <br></br>
            <h1 className="text-2xl font-bold mb-4 text-center">ใบเสนอราคา</h1>
            <h2>ค้นหาใบเสนอราคา</h2>
            <input type="text" placeholder='ระบุวันที่ หรือ ชื่อผู้แก้ไข' onChange={SearchData} className='form-control' />
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Quotation NO.</th>
                        <th>ลูกค้า</th>
                        <th>JOB NO.</th>
                        <th>วันที่</th>
                        <th>จำนวนเงิน</th>
                        <th>รายอะเอียด</th>
                        <th>แก้ไขล่าสุดโดย</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        props.records.map((element, index) => (
                            <tr key={index}>
                                <td>{element.id}</td>
                                <td>{element.full_name}</td>
                                <td>{element.job_id}</td>
                                <td>{format(new Date(element.quotation_date), "dd-MM-yyyy")}</td>
                                <td>{element.total_amount}</td>
                                <td>{element.details}</td>
                                <td>{element.update_record}</td>
                                {/* Your existing code for buttons can remain unchanged */}


                                <td><button className="btn btn-outline btn-accent m-2" onClick={() => createpdf_QuotationId(element)}>เลือกเอกสารนี้</button></td>
                                <td> <button className="btn  m-2" onClick={() => { editCreate_Quotation(element); props.setDisplayComponent("Create_Quotation_edit"); }} > แก้ไข </button> </td>


                                <td><button onClick={() => { if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) { deleteCreate_Quotation(element.id); } }} className="btn btn-error m-2">ลบ </button></td>
                            </tr>
                        ))
                    }
                </tbody>

            </table>
            <div className="flex items-center justify-center space-x-2"> </div>
            <button className="btn btn-success m-2" onClick={() => props.setDisplayComponent("Create_Quotation_add")}>เพิ่มข้อมูลใบเสนอราคา</button>
            <button onClick={() => exportPDF()} disabled={!isPdfReady} className="btn btn-accent m-2">สร้างเอกสาร</button>
            {/* <div><button className="btn btn-error m-2" onClick={() => props.setDisplayComponent("Create_Quotation_search")}>กลับ</button> </div> */}

            <div>  <label htmlFor="picture">โปรดเลือกไฟล์รูปภาพ:</label>  <input type="file" id="picture" onChange={handleFileChange} /> </div>
            <button onClick={() => Save_img()} disabled={!isPdfReady} className="btn btn-active btn-primary m-2">บันทึกภาพ</button>
            <div> <h2>ภาพเอกสารใบรเสนอราคาที่บันทึกไว้</h2> {pictureUrl ? (<img src={pictureUrl} alt="Car Quotation" style={{ maxWidth: '100%' }} />) : (<p>ไม่พบรูปภาพ หรือ ท่านยังไม่เลือกเอกสาร</p>)} </div>
        </>
    );
}
