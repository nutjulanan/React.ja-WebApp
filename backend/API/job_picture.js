const multer = require('multer');

const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // ตำแหน่งที่จะเก็บไฟล์
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่เพื่อไม่ให้ชื่อซ้ำกัน
    }
});

const upload = multer({ storage: storage });


module.exports = function(db) {

    const express = require('express');
    const router = express.Router();


    const tableName = 'job_picture';

    const idColumn = 'id';  
    const responsible_Employee_idColumn = 'responsible_Employee_id';    //1
    const job_idColumn = 'job_id';  //2
    const pictureColumn = 'picture';    //3
    const detailsColumn = 'details';    //4
    const job_statusColumn = 'job_status';    //5
    const updated_atColumn = 'updated_at';  //6

    router.post('/uploadjob_picture', upload.single('picture'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        const file = await fs.promises.readFile(req.file.path);
        // แปลงไฟล์เป็นรูปแบบที่เหมาะสมก่อนเก็บลงฐานข้อมูล หรือเก็บลง storage ภายนอกและเก็บ URL ไว้ในฐานข้อมูล

        const insertQuery = `
            INSERT INTO ${tableName} (${responsible_Employee_idColumn}, ${job_idColumn}, ${pictureColumn}, ${detailsColumn}, ${job_statusColumn}, ${updated_atColumn})
            VALUES ($1, $2, $3, $4, $5,  current_timestamp)
            RETURNING ${idColumn}
        `;
        
        // ตรวจสอบและแก้ไขข้อมูลที่รับมาจากผู้ใช้เพื่อป้องกัน SQL Injection
        const result = await db.one(insertQuery, [ req.body.responsible_Employee_id, req.body.job_id, file, req.body.details, req.body.job_status]);
    
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    } finally {
        // ใช้ async ในการลบไฟล์เพื่อไม่ให้บล็อค execution
        try {
            await fs.promises.unlink(req.file.path);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }
    });

    router.put('/updatejob_picture/:id', upload.single('picture'), async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        // ตรวจสอบว่ามีไฟล์รูปภาพถูกอัปโหลดหรือไม่
        const picturePath = req.file ? req.file.path : null;
    
        // รับข้อมูลจาก req.body
        const { responsible_Employee_id, job_id, details, job_status} = req.body;
    
        try {
            // สร้างคำสั่ง SQL สำหรับอัพเดทข้อมูล
            const query = `
                UPDATE ${tableName} SET
                responsible_Employee_id = $1, job_id = $2, picture = $3, details = $4, job_status = $5,
                updated_at = current_timestamp
                WHERE id = $6 RETURNING *;
            `;
    
            const values = [responsible_Employee_id, job_id, picturePath, details, job_status, id];
    
            const result = await db.oneOrNone(query, values);
    
            if (result) {
                res.json(result);
            } else {
                res.status(404).send('Data not found.');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.delete('/deletejob_picture/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *;`;
            const deletedData = await db.oneOrNone(query, [id]);
    
            if (deletedData) {
                res.status(200).json({ message: 'Data deleted successfully', deletedData });
            } else {
                res.status(404).send('Data not found or already deleted');
            }
        } catch (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Server Error');
        }
    });
    
    // Route สำหรับดึงข้อมูลทั้งหมด
    router.get('/fetchAlljob_picture', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM job_picture');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchjob_pictureById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM job_picture WHERE id = $1';
            const data = await db.oneOrNone(query, [id]); // ใช้ oneOrNone ในกรณีที่อาจไม่มีข้อมูลตรงกับ id ที่ระบุ
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).send('Data not found'); // ส่งข้อความ "Data not found" ถ้าไม่มีข้อมูล
            }
        } catch (err) {
            console.error('Error fetching data by id:', err);
            res.status(500).send('Server Error');
        }
    });

    return router;
};
