import React, { useState } from 'react';

export default function EditWeb() {
    // add

    const [Addfile, setAddFile] = useState(null);
    const [Addtitle, setAddTitle] = useState(''); // ใช้ title แทน name
    const [Adddescription, setAddDescription] = useState(''); // ใช้ description แทน info

    const AddhandleFileChange = (e) => {
        setAddFile(e.target.files[0]);
    };

    const AddhandleTitleChange = (e) => { // ฟังก์ชันนี้เปลี่ยนจาก handleNameChange
        setAddTitle(e.target.value);
    };

    const AddhandleDescriptionChange = (e) => { // ฟังก์ชันนี้เปลี่ยนจาก handleInfoChange
        setAddDescription(e.target.value);
    };

    const AddhandleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', Addfile);
        formData.append('name', Addtitle); // เปลี่ยนชื่อฟิลด์เป็น name ตาม API
        formData.append('info', Adddescription); // เปลี่ยนชื่อฟิลด์เป็น info ตาม API

        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Upload Success:', result);
                // Handle success
            } else {
                // Handle server errors or invalid responses
                console.error('Upload Failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // update

    const [id, setId] = useState('');
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState(''); // ใช้ title แทน name
    const [description, setDescription] = useState(''); // ใช้ description แทน info

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleIdChange = (e) => {
        setId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (file) {
            formData.append('image', file);
        }
        formData.append('name', title);
        formData.append('info', description);

        try {
            const response = await fetch(`http://localhost:3001/update/${id}`, {
                method: 'PUT',
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Update Success:', result);
                // Handle success
            } else {
                // Handle server errors or invalid responses
                console.error('Update Failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            {/* สำหรับเพิ่ม */}
            <form onSubmit={AddhandleSubmit}>
                <h1 className="text-3xl">เพิ่มเนื้อหาเว็บไซต์</h1>
                <div className="container_card">
                    <div className="Box1 h2-border">
                        <h2 className="text-3xl">[Box0]</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <label className="form-control w-full max-w-xs">
                                <span className="label-text">อัพโหลดรูป</span>
                                <input type="file" onChange={AddhandleFileChange} className="file-input file-input-bordered w-full max-w-xs" />
                            </label>
                        </div>
                        <label className="form-control w-full max-w-xs">
                            <span className="label-text">title</span>
                            <input type="text" value={Addtitle} onChange={AddhandleTitleChange} placeholder="ป้อนข้อความ" className="input input-bordered w-full max-w-xs" />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <span className="label-text">Description</span>
                            <textarea value={Adddescription} onChange={AddhandleDescriptionChange} className="textarea textarea-bordered" placeholder="รายละเอียดข้อความ"></textarea>
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-active btn-primary px-10 py-2">บันทึก</button>
            </form>
            
            {/* สำหรับอัพเดท */}

            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl">อัพเดทเนื้อหาเว็บไซต์</h1>
                <div className="container_card">
                    <div className="Box1 h2-border">
                        <h2 className="text-3xl">[Box1]</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <label className="form-control w-full max-w-xs">
                                <span className="label-text">ID</span>
                                <input type="text" value={id} onChange={handleIdChange} placeholder="ป้อน ID" className="input input-bordered w-full max-w-xs" />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <span className="label-text">อัพโหลดรูปใหม่</span>
                                <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs" />
                            </label>
                        </div>
                        <label className="form-control w-full max-w-xs">
                            <span className="label-text">Title</span>
                            <input type="text" value={title} onChange={handleTitleChange} placeholder="ป้อนชื่อ" className="input input-bordered w-full max-w-xs" />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <span className="label-text">Description</span>
                            <textarea value={description} onChange={handleDescriptionChange} className="textarea textarea-bordered" placeholder="รายละเอียด"></textarea>
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-active btn-primary px-10 py-2">อัพเดท</button>
            </form>

        </>
    );
}
