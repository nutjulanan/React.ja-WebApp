module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/Addcardata', async (req, res) => {
        try {
            const { registration_id, owner_id, Policy_number, insurance_company, insurance_expiry_date, car_type, brand, model, year, color, engine_number, chassis_number, Gear_type, detail, update_record} = req.body;
            const query = `
                INSERT INTO car (registration_id, owner_id, Policy_number, insurance_company, insurance_expiry_date, car_type, brand, model, year, color, engine_number, chassis_number, Gear_type, detail, update_record)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11, $12, $13, $14, $15)
                RETURNING *; 
            `;
            const values = [registration_id, owner_id, Policy_number, insurance_company, insurance_expiry_date, car_type, brand, model, year, color, engine_number, chassis_number, Gear_type, detail, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newcar = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newcar);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new car:', err);
            res.status(500).send('Server error');
        }
    });

    router.put('/Updatecardata/:id', async (req, res) => {
        try {
            const registration_id  = req.params.id;
            const { owner_id, Policy_number, insurance_company, insurance_expiry_date, car_type, brand, model, year, color, engine_number, chassis_number, Gear_type, detail, update_record } = req.body;
            const query = `
                UPDATE car SET owner_id = $1, Policy_number = $2, insurance_company = $3, insurance_expiry_date = $4, car_type = $5, brand = $6, model = $7, year = $8, color = $9, engine_number  = $10, chassis_number = $11, Gear_type  = $12, detail = $13, update_record = $14, updated_at = CURRENT_TIMESTAMP
                WHERE registration_id  = $15
                RETURNING *;
            `;
            const values = [owner_id, Policy_number, insurance_company, insurance_expiry_date, car_type, brand, model, year, color, engine_number, chassis_number, Gear_type, detail, update_record, registration_id ];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedcar = await db.oneOrNone(query, values);
            
            if (updatedcar) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedcar);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('car not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating car:', err);
            res.status(500).send('Server error');
        }
    });

    router.delete('/deletecar/:registration_id', async (req, res) => {
        const registration_id = req.params.registration_id;
    
        try {
            // SQL command to delete data
            const query = `DELETE FROM car WHERE registration_id = $1 RETURNING *;`;
            const deletedData = await db.oneOrNone(query, [registration_id]);
    
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
    router.get('/fetchAllcar', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM car');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });
    
    router.get('/fetchAllcarById/:registration_id', async (req, res) => {
        const id = req.params.registration_id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM car WHERE registration_id = $1';
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
