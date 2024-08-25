module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/Addservicedata', async (req, res) => {
        try {
            const { service_name, unit_price, description,  update_record } = req.body;
            const query = `
                INSERT INTO service (service_name, unit_price, description, update_record)
                VALUES ($1, $2, $3, $4)
                RETURNING *; 
            `;
            const values = [service_name, unit_price, description, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newservice = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newservice);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new service:', err);
            res.status(500).send('Server error');
        }
    });

    
    router.put('/Updateservice/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { service_name, unit_price, description,  update_record} = req.body;
            const query = `
                UPDATE service SET service_name = $1, unit_price = $2, description = $3, update_record = $4, updated_at = CURRENT_TIMESTAMP
                WHERE id = $5
                RETURNING *;
            `;
            const values = [service_name, unit_price, description,  update_record, id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedservice = await db.oneOrNone(query, values);
            
            if (updatedservice) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedservice);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('service not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating service:', err);
            res.status(500).send('Server error');
        }
    });

    
    router.delete('/deleteservice/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM service WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllservice', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM service');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllserviceById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM service WHERE id = $1';
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
