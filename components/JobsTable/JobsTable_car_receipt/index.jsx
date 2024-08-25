import axios from 'axios';
import React, { useEffect, useState } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // นำเข้า vfs_fonts ตามปกติ
import angsaFontBase64 from '/font/angsa.js';
import angsabBase64 from '/font/angsab.js';
import angsaiBase64 from '/font/angsai.js';
import angsananewbolditalicBase64 from '/font/angsananewbolditalic.js';

import Selectcar_receipt from './selectcar_receipt'

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


export default function writepdfcar_receipt(props) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [displayComponent, setDisplayComponent] = useState("Selectcar_receipt");


    const [garage, setGarage] = useState(null);
    const [carReceipt, setCarReceipt] = useState(null);
    const [carReceiptDate, setcarReceiptDate] = useState({
        dd: '',
        MM: '',
        yyyy: ''
    });
    const [jobDate, setjobDate] = useState({
        dd: '',
        MM: '',
        yyyy: ''
    });
    const [jobDetails, setJobDetails] = useState(null);
    const [carDetails, setCarDetails] = useState(null);
    const [error, setError] = useState('');

    const [file, setFile] = useState(null);
    const [pictureUrl, setPictureUrl] = useState('');
    const [pictureImg, setPictureImg] = useState(null);

    const [data, setData] = useState([])
    const [records, setRecords] = useState(data)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const fetchCarReceiptById = async (id) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAllcar_receiptById/${id}`);
            setCarReceipt(response.data);
            carReceiptDate.dd = format(new Date(response.data.reception_date), "dd");
            carReceiptDate.MM = getMonthName(format(new Date(response.data.reception_date), "MM"));
            carReceiptDate.yyyy = convertADtoBE(format(new Date(response.data.reception_date), "yyyy"));
            await fetchJobById(response.data.job_id)

        } catch (error) {
            setError('Failed to fetch data');
            console.error('There was an error!', error);
        }
    };

    const fetchJobById = async (id) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAlljobById/${id}`);
            setJobDetails(response.data);

            jobDate.dd = format(new Date(response.data.car_in), "dd");
            jobDate.MM = getMonthName(format(new Date(response.data.car_in), "MM"));
            jobDate.yyyy = convertADtoBE(format(new Date(response.data.car_in), "yyyy"));

            await fetchCarByRegistrationId(response.data.car_id)
        } catch (error) {
            setError('Failed to fetch job details');
            console.error('Error:', error);
        }
    };

    const fetchCarByRegistrationId = async (registrationId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/fetchAllcarById/${registrationId}`);
            setCarDetails(response.data);
        } catch (error) {
            setError('Failed to fetch car details');
            console.error('Error:', error);
        }
    };

    const fetchReceiptPicture = async (receiptId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/car_receipts/${receiptId}/picture`, { responseType: 'blob' });
            setPictureUrl(URL.createObjectURL(response.data));
            setPictureImg(response.data);
        } catch (error) {
            console.error('There was an error fetching the car receipt picture!', error);
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const fetchAPI = async () => {
        const response = await axios.get(`${VITE_API_URL}/fetchAllcar_receiptByjob_id/${props.currentJob.id}`)

        const result = response.data;
        let updatedData = [];
        for (const item of result) {
            const response_name = await axios.get(`${VITE_API_URL}/fetchAllcustomerById/${item.customer_id}`);

            updatedData.push({
                ...item,
                full_name: response_name.data.full_name // เพิ่มข้อมูลใหม่ที่คุณต้องการ
            });
        }

        setData(updatedData)
        setData(currentData => currentData.sort((a, b) => a.id - b.id));
        setRecords(updatedData)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


    const [isPdfReady, setIsPdfReady] = useState(false);

    const createpdf_QuotationId = async (car_receiptId) => {
        setIsPdfReady(false);
        await fetchGarageDetails();
        await fetchCarReceiptById(car_receiptId.id);
        await fetchReceiptPicture(car_receiptId.id);

        setIsPdfReady(true);
    };



    useEffect(() => {
        fetchGarageDetails();
    }, []);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const exportPDF = () => {
        const documentDefinition = {
            content: [

                {
                    text: 'REC No. ' + carReceipt.id + '\nJOB No. ' + jobDetails.id,
                    style: 'header',
                    alignment: 'right',
                    fontSize: 14
                },


                {
                    text: [
                        { text: garage.garage_name + '\n', fontSize: 30, alignment: 'center', bold: true },
                        { text: garage.address, fontSize: 16, alignment: 'center' },
                        { text: 'โทร. ' + garage.telephone_number, fontSize: 16, alignment: 'center' },
                        { text: '\n' + garage.detail_garages, fontSize: 16, alignment: 'center' },
                        { text: 'เลขประจำตัวผู้เสียภาษีอากร ' + garage.tin, fontSize: 16, alignment: 'center' },
                    ], margin: [0, 40, 0, 0]
                },


                {
                    text: 'ใบรับรถ',
                    style: 'header',
                    alignment: 'center',
                    fontSize: 24,
                    bold: true,
                    margin: [0, 0, 0, 0]

                },
                {
                    // text: 'วันที่ '+format(new Date(carReceipt.reception_date), "dd/MM/yyyy"),
                    text: 'วันที่ ' + jobDate.dd + ' เดือน ' + jobDate.MM + ' พ.ศ. ' + jobDate.yyyy,
                    style: 'header',
                    alignment: 'right',
                    fontSize: 14,
                    margin: [0, 30, 0, 0]
                },

                {
                    text: [
                        { text: 'ได้รับรถยี่ห้อ ', fontSize: 16 },
                        { text: carDetails.brand, fontSize: 16, bold: true },
                        { text: ' ทะเบียน ', fontSize: 16 },
                        { text: carDetails.registration_id, fontSize: 16, bold: true },
                        { text: ' ไว้เพื่อซ่อมแซม\nขอให้เจ้าของรถหรือผู้แทนมารับรถคันดังกล่าวได้ใน ', fontSize: 16 },
                        { text: 'วันที่ ' + carReceiptDate.dd + ' เดือน ' + carReceiptDate.MM + ' พ.ศ. ' + carReceiptDate.yyyy, fontSize: 16, bold: true },

                    ],
                    margin: [0, 10, 0, 0],
                    alignment: 'right'
                },

                {
                    text: [
                        { text: '*หมายเหตุ \n', fontSize: 16 },
                        { text: jobDetails.repair_details ? jobDetails.repair_details + "\n" : '-', fontSize: 16, bold: true },
                        { text: carReceipt.repair_details, fontSize: 16, bold: true },

                    ],

                    margin: [0, 0, 0, 10],
                    alignment: 'left'
                },

                {
                    text: [
                        { text: 'ลงชื่อผู้รับรถ ', fontSize: 16 },
                        { text: '............................................................................................................', fontSize: 16, bold: true },

                    ],

                    margin: [0, 20, 0, 0],
                    alignment: 'center'
                },
                {
                    text: [
                        { text: '(โปรดรักษาใบรับรถฉบับนี้ไว้เพื่อเป็นหลักฐานรับรถของท่านคืน)', fontSize: 16, bold: true },

                    ],

                    margin: [0, 10, 0, 0],
                    alignment: 'center'
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

    const Save_img = async () => {

        if (!file || !carReceipt.id) {
            alert('Please select a file and enter a receipt ID.');
            return;
        }

        const formData = new FormData();
        formData.append('picture', file);

        try {
            const response = await axios.put(`${VITE_API_URL}/car_receipts/${carReceipt.id}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchReceiptPicture(carReceipt.id);
            alert('Picture updated successfully');
            console.log(response.data);
        } catch (error) {
            console.error('Error updating car receipt picture:', error);
            alert('Failed to update picture');
        }

    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <>
                <div>
                    <button onClick={() => { props.setDisplayComponent("JobsTable_search"); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 w-60 rounded mr-2">กลับไปหน้ารายการซ่อม</button><br></br>
                    {displayComponent === "Selectcar_receipt" && <Selectcar_receipt fetchAPI={fetchAPI} setDisplayComponent={setDisplayComponent} records={records} data={data} createpdf_QuotationId={createpdf_QuotationId} />}

                    <div className="label">  {carReceipt ? (<span className="label-text">{"เอกสารที่เลือกคือหมายเลข " + carReceipt.id}</span>) : (<span className="label-text">โปรดเลือกเอกสาร</span>)} </div>

                    {/* Disable the button if isPdfReady is false */}
                    <button onClick={() => exportPDF()} disabled={!isPdfReady} className="btn btn-warning m-2">สร้างเอกสาร</button>


                    {/* <button onClick={() => Save_img()} disabled={!isPdfReady} className="btn btn-error m-2">บันทึกภาพ</button> */}
                    {/* <div>  <label htmlFor="picture">Picture:</label>  <input type="file" id="picture" onChange={handleFileChange} /> </div> */}
                    <div> <h2>ภาพเอกสารใบรับรถ</h2> {pictureUrl ? (<img src={pictureUrl} alt="Car Receipt" style={{ maxWidth: '100%' }} />) : (<p>คุณยังไม่ได้เลือกเอกสาร หรือ ไม่มีรูปภาพ</p>)} </div>
                </div>
            </>
        </>
    );
}
