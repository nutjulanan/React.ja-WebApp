import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/JobPictures.css';
// กำหนด URL ของ API
const VITE_API_URL = import.meta.env.VITE_API_URL;

const JobPictures = () => {
  const [jobPictures, setJobPictures] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


//Zoom
function ImageModal({ isOpen, imageSrc, onClose }) {
  if (!isOpen) return null;

  // หยุดการ propagation เมื่อคลิกภายใน modal เพื่อไม่ให้ trigger การปิด
  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-2 rounded max-w-3xl max-h-full overflow-auto" onClick={handleModalContentClick}>
        <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src={imageSrc} alt="Zoomed" className="max-w-full max-h-full"/>
      </div>
    </div>
  );
}

  const openModalWithImage = (imageSrc) => {
    setSelectedImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
const handleStatusChange = (event) => {
  setSelectedJobStatus(event.target.value);
};


  // โหลดข้อมูลรูปภาพเมื่อ component ถูก mount
  useEffect(() => {
    fetchJobPictures();
  }, []);

  // ฟังก์ชันสำหรับโหลดข้อมูลรูปภาพ
  const fetchJobPictures = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAlljob_picture`);
      setJobPictures(response.data);
    } catch (error) {
      console.error('Error fetching job pictures:', error);
    }
  };

  // ฟังก์ชันสำหรับแปลงข้อมูล Buffer ไปเป็น Base64
  const bufferToBase64 = (buffer) => {
    return btoa(
      buffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  };

  // ฟังก์ชันสำหรับการจัดการ submit ของฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post(`${VITE_API_URL}/uploadjob_picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      fetchJobPictures(); // โหลดข้อมูลใหม่หลังจากเพิ่มข้อมูล
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/deletejob_picture/${id}`);
      alert('ลบข้อมูลสำเร็จ');
      fetchJobPictures(); // โหลดข้อมูลใหม่หลังจากลบ
    } catch (error) {
      console.error('Error deleting job picture:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };
  
    // ฟังก์ชันสำหรับการค้นหา
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
      // ฟังก์ชันสำหรับกรองข้อมูลตาม Job ID
      const filteredJobPictures = searchTerm
      ? jobPictures.filter(jobPicture =>
          String(jobPicture.job_id).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : jobPictures;

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-center">อัพโหลดรูปภาพรายการซ่อม</h2>
      <div className="form-container mb-6 p-5 bg-white shadow-lg rounded-lg">
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <input className="input input-bordered w-full" name="responsible_Employee_id" type="text" placeholder="Responsible Employee ID" required />
      <input className="input input-bordered w-full" name="job_id" type="text" placeholder="Job ID" required />
      <input className="input input-bordered w-full" name="details" type="text" placeholder="Details" />
    <div className="mt-4">
      <input type="file" name="picture" required />
    </div>
      <div className="form-control mt-4">
        <select name="job_status" value={selectedJobStatus} onChange={handleStatusChange} className="select select-bordered w-full">
          <option value="" disabled>เลือกสถานะ</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="in_progress">กำลังดำเนินการ</option>
          <option value="completed">เสร็จสิ้น</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
      </div>
      <div className="text-right mt-4">
      <button type="submit" className="btn btn-primary">บันทึก</button>
      </div>
    </form>
    </div>
    <div className="search-form my-6 flex justify-center">
  <input type="text" className="input input-bordered w-full max-w-lg" placeholder="Search by Job ID..." value={searchTerm} onChange={handleSearchChange} />
</div>

    <hr className="my-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredJobPictures.map((jobPicture) => (
        <div key={jobPicture.id} className="card card-bordered card-compact bg-base-100 shadow-xl"> 
   <button className="btn btn-square absolute right-2 top-2" onClick={() => {
      if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
        handleDelete(jobPicture.id);
      }
    }}> 
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

        
          <figure className="px-10 pt-10 cursor-zoom-in" onClick={() => openModalWithImage(`data:image/jpeg;base64,${bufferToBase64(jobPicture.picture.data)}`)}>
            <img src={`data:image/jpeg;base64,${bufferToBase64(jobPicture.picture.data)}`} alt={`Job Picture ${jobPicture.id}`} className="rounded-xl" />
          </figure>
    <div className="card-body">
      <h2 className="card-title">Job ID: {jobPicture.job_id}</h2>
      <p>Responsible Employee ID: {jobPicture.responsible_employee_id}</p>
      <p>Details: {jobPicture.details}</p>
      <p>Status: {jobPicture.job_status}</p>

    </div>
  </div>
))}

  </div>
  <ImageModal isOpen={isModalOpen} imageSrc={selectedImageSrc} onClose={closeModal} />

</div>

  );
};

export default JobPictures;
