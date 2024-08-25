module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/AddHolidaysdata', async (req, res) => {
        try {
            const { date, nameholidays, workdaystatus, update_record } = req.body;
            const query = `
                INSERT INTO Holidays (date, nameholidays, workdaystatus, update_record)
                VALUES ($1, $2, $3, $4)
                RETURNING *; 
            `;
            const values = [date, nameholidays, workdaystatus, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newHolidays = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newHolidays);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new Holidays:', err);
            res.status(500).send('Server error');
        }
    });

    
    router.put('/UpdateHolidays/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { date, nameholidays, workdaystatus, update_record } = req.body;
            const query = `
                UPDATE Holidays SET date = $1, nameholidays = $2, workdaystatus = $3, update_record = $4,   updated_at = CURRENT_TIMESTAMP
                WHERE id = $5
                RETURNING *;
            `;
            const values = [date, nameholidays, workdaystatus, update_record , id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedHolidays = await db.oneOrNone(query, values);
            
            if (updatedHolidays) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedHolidays);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('Holidays not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating Holidays:', err);
            res.status(500).send('Server error');
        }
    });

    router.delete('/deleteHolidays/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM Holidays WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllHolidays', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM Holidays');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllwork', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM Holidays');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });


    router.get('/fetchAllHolidaysById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM Holidays WHERE id = $1';
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
