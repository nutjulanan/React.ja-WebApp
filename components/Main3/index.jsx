import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/JobPictures.css';
import '../CSS/Main3.css';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

export default function Main3() {
  const [carId, setCarId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [jobPictures, setJobPictures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false); // Add a state to track if search has been performed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');

  useEffect(() => {
    fetchJobPictures();

    const handleScroll = () => {
      const offset = window.pageYOffset;
      setParallaxOffset(offset * 0.5); // Adjust the 0.5 to control the speed of the parallax
    };

    // Throttle scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchJobPictures = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAlljob_picture`);
      setJobPictures(response.data);
    } catch (error) {
      console.error('Error fetching job pictures:', error);
    }
  };

  const bufferToBase64 = (buffer) => {
    return btoa(
      buffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/fetchAlljobById/${carId}`);
      setJobs([response.data]); // Convert response.data to an array because it might return just a single object
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // Reset jobs on error
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCarId(value);
    setSearchTerm(value); // Set searchTerm to the same value
    setIsSearched(false); // Reset isSearched when input value changes
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setIsSearched(true); // Set isSearched to true when search is triggered
    await Promise.all([fetchJobs(), fetchJobPictures()]);
    setIsSearching(false);
  };

  const openModalWithImage = (imageSrc) => {
    setSelectedImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageSrc(''); // Reset selected image source when closing modal
  };

  const handleStatusChange = (event) => {
    setSelectedJobStatus(event.target.value);
  };

  const filteredJobPictures = searchTerm
    ? jobPictures.filter(jobPicture =>
      String(jobPicture.job_id).toLowerCase().includes(searchTerm.toLowerCase())
    )
    : jobPictures;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };


  return (
    <>
      <div id="main3Section" className="hero min-h-screen" style={{ backgroundImage: 'url(https://s359.kapook.com//pagebuilder/0e38ac75-6ee9-49dd-96a0-2f57881a2b96.jpg)', backgroundSize: 'cover', backgroundPosition: `center ${parallaxOffset}px` }}>
        <div className="hero-overlay bg-opacity-90"></div>
        <div className="">
          <div className="hero-content text-center text-neutral-content">
            <div className="search-form my-6">
              <h1 className="mb-5 text-5xl font-bold">เช็คความคืบหน้า</h1>
              <p className="mb-5">ป้อนรหัสใบซ่อมรถยนต์หรือ Job ID ของท่าน</p>
              <div className="search-form flex my-6 items-center">
                <input type="text" className="input input-bordered input-warning w-full max-w-xs text-green-900" placeholder="ป้อนรหัสใบซ่อมรถยนต์" value={searchTerm} onChange={handleInputChange} onKeyPress={handleKeyPress} />
                <button onClick={handleSearch} className="btn btn-success m-2" disabled={isSearching}>ค้นหา</button>
              </div>
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="container mx-auto px-4 py-2 mt-8">
              {/* Example of displaying jobs */}
              {jobs.map((job, index) => (
                <div key={index} className="p-4 m-2 bg-white rounded shadow text-green-900">
                  <p className="text-lg font-semibold">ทะเบียนรถยนต์: {job.car_id}</p>
                  <p className="text-lm text-red-600">สถานะงาน: {job.job_status}</p>
                  <p>รายละเอียด: {job.repair_details}</p>
                </div>
              ))}
            </div>
          )}

          {isSearching && (
            <p>Searching...</p>
          )}

          {isSearched && !isSearching && filteredJobPictures.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobPictures.map((jobPicture) => (
                <div key={jobPicture.id} className="card card-bordered card-compact bg-base-100 shadow-xl">
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
          )}
        </div>
      </div>

      {/* Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${isModalOpen ? '' : 'hidden'}`} onClick={closeModal}>
        <div className="bg-white p-2 rounded max-w-3xl max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeModal} className="btn btn-sm btn-circle absolute right-2 top-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={selectedImageSrc} alt="Zoomed" className="max-w-full max-h-full" />
        </div>
      </div>
    </>
  );
}
