import jsPDF from 'jspdf';

// สร้าง instance ของ jsPDF
const doc = new jsPDF();

// เพิ่มเนื้อหาลงในเอกสาร
doc.text('Hello world!', 10, 10);

// บันทึกเอกสารเป็นไฟล์ PDF
doc.save('a4.pdf');
