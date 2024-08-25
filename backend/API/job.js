module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/Addjobdata', async (req, res) => {
        try {
            const {responsible_Employee_id, car_id, car_in, car_out, car_finished, job_status, repair_details, customer_feedback, update_record} = req.body;
            const query = `
                INSERT INTO job (responsible_Employee_id, car_id, car_in, car_out, car_finished, job_status, repair_details, customer_feedback, update_record)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *; 
            `;
            const values = [responsible_Employee_id, car_id, car_in, car_out, car_finished, job_status, repair_details, customer_feedback, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newjob = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newjob);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new job:', err);
            res.status(500).send('Server error');
        }
    });

    router.put('/Updatejobdata/:id', async (req, res) => {
        try {
            const id  = req.params.id;
            const { responsible_Employee_id, car_id, car_in, car_out, car_finished, job_status, repair_details, customer_feedback, update_record} = req.body;
            const query = `
                UPDATE job SET responsible_Employee_id = $1, car_id = $2, car_in = $3, car_out = $4, car_finished = $5, job_status = $6, repair_details = $7, customer_feedback = $8, update_record = $9 ,updated_at = CURRENT_TIMESTAMP
                WHERE id  = $10
                RETURNING *;
            `;
            const values = [responsible_Employee_id, car_id, car_in, car_out, car_finished, job_status, repair_details, customer_feedback, update_record, id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedjob = await db.oneOrNone(query, values);
            
            if (updatedjob) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedjob);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('job not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating job:', err);
            res.status(500).send('Server error');
        }
    });

    router.delete('/deletejob/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM job WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAlljob', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM job');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });
    
    router.get('/fetchAlljobById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM job WHERE id = $1';
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
