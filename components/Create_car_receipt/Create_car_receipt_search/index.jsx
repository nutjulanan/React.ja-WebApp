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

export default function Create_car_receipt_search(props) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [isPdfReady, setIsPdfReady] = useState(false);
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const fetchGarageDetails = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/garage/${1}`);
            setGarage(response.data);
        } catch {
            console.error('Error :', error);
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

    const fetchReceiptPicture = async (receiptId) => {
        try {
            const response = await axios.get(`${VITE_API_URL}/car_receipts/${receiptId}/picture`, { responseType: 'blob' });
            setPictureUrl(URL.createObjectURL(response.data));
            setPictureImg(response.data);
        } catch (error) {
            console.error('There was an error fetching the car receipt picture!', error);
            setPictureUrl(null);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const createpdf_Car_receipt = async (car_receiptId) => {
        setIsPdfReady(false);
        await fetchGarageDetails();
        await fetchCarReceiptById(car_receiptId.id);


        setIsPdfReady(true);

        await fetchReceiptPicture(car_receiptId.id);
    };

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

    const exportPDF = () => {
        const documentDefinition = {
            content: [

                {
                    text: 'No. ' + carReceipt.id + '\nJOB No. ' + jobDetails.id,
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
                        { text: jobDetails.repair_details ? jobDetails.repair_details + "\n" : '', fontSize: 16, bold: true },
                        { text: carReceipt.estimated_cost ? "ค่ามัดจำ " + carReceipt.estimated_cost + "บาท\n" : '', fontSize: 16, bold: true },


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


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const deleteCreate_car_receipt = async (id) => {
        try {
            const response = await axios.delete(`${VITE_API_URL}/deletecar_receipt/${id}`);
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
        setIsPdfReady(false);
    };

    const editCreate_car_receipt = async (element) => {
        props.setNewcar_receipt({
            id: element.id,
            customer_id: element.customer_id,
            job_id: element.job_id,
            estimated_cost: element.estimated_cost,
            receipt_status: element.receipt_status,
            reception_date: format(new Date(element.reception_date), "yyyy-MM-dd")

        });
        setIsPdfReady(false);
    };


    useEffect(() => {
        props.fetchAPI()
        fetchGarageDetails();
    }, [])

    const SearchData = (e) => {
        const filter = props.data.filter(element =>
            format(new Date(element.reception_date), "dd-MM-yyyy").includes(e.target.value) ||
            (element.update_record?.toLowerCase() ?? "").includes(e.target.value)
        )
        props.setRecords(filter)
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <br></br>
            <h1 className="text-2xl font-bold mb-4 text-center">ใบรับรถ</h1>
            <h2>ค้นหาเอกสาร</h2>
            <input type="text" placeholder='ระบุวันที่ หรือ ชื่อผู้แก้ไข' onChange={SearchData} className='form-control' />
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>REC NO.</th>
                        <th>JOB NO.</th>
                        <th>ลูกค้าชื่อ</th>

                        <th>ค่ามัดจำล่าวงหน้า</th>
                        <th>วันที่</th>
                        <th>ลายเซ็น</th>
                        <th>แก้ไขล่าสุดโดย</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        props.records.map((element, index) => (
                            <tr key={index}>
                                <td>{element.id}</td>
                                <td>{element.job_id}</td>
                                <td>{element.full_name}</td>

                                <td>{element.estimated_cost}</td>
                                <td>{format(new Date(element.reception_date), "dd-MM-yyyy")}</td>
                                <td>{element.receipt_status}</td>
                                <td>{element.update_record}</td>
                                {/* Your existing code for buttons can remain unchanged */}


                                <td><button className="btn btn-outline btn-accent m-2  w-full md:w-auto px-10 py-3 whitespace-nowrap" onClick={() => createpdf_Car_receipt(element)}>เลือกเอกสารนี้</button></td>

                                <td> <button className="btn  m-2" onClick={() => { editCreate_car_receipt(element); props.setDisplayComponent("Create_car_receipt_edit"); }} > แก้ไข </button> </td>

                                <td><button onClick={() => { if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) { deleteCreate_car_receipt(element.id); } }} className="btn btn-error m-2">ลบ </button></td>

                            </tr>
                        ))
                    }
                </tbody>

            </table>
            <button className="btn btn-success m-2" onClick={() => props.setDisplayComponent("Create_car_receipt_add")}>เพิ่มข้อมูลใบรับรถ</button>
            <button onClick={() => exportPDF()} disabled={!isPdfReady} className="btn btn-accent m-2 ">สร้างเอกสาร</button>
            <button onClick={() => Save_img()} disabled={!isPdfReady} className="btn btn-active btn-primary m-2">ยืนยันการบันทึกข้อมูลภาพ</button>
            <div>  <label htmlFor="picture">โปรดเลือกไฟล์รูปภาพ:</label>  <input type="file" id="picture" onChange={handleFileChange} /> </div>
            <div> <h2>ภาพเอกสารใบรับรถที่บันทึกไว้</h2> {pictureUrl ? (<img src={pictureUrl} alt="Car Receipt" style={{ maxWidth: '100%' }} />) : (<p>ไม่พบรูปภาพ หรือ ท่านยังไม่เลือกเอกสาร</p>)} </div>
        </>
    );
}
