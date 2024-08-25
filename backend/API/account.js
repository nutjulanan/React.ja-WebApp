module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    // เพิ่มข้อมูล

    
    // router.post('/AddAccountdata', async (req, res) => {
    //     try {
    //         const { Data_id, username, password_hash, update_record } = req.body; // รับข้อมูลจาก body
    //         const insertQuery = 'INSERT INTO account (Data_id, username, password_hash, update_record) VALUES ($1, $2, $3, $4) RETURNING *';
    //         const insertedData = await db.one(insertQuery, [Data_id, username, password_hash, update_record]);
    //         res.json(insertedData);
    //     } catch (error) {
    //         console.error('Error inserting data:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // });
    router.post('/AddAccountdata', async (req, res) => {
        try {
            const { Data_id, username, password_hash, update_record } = req.body;
            
            // Simple validation (add more validation as needed)
            if (!username || !password_hash) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
    
            const insertQuery = 'INSERT INTO account (Data_id, username, password_hash, update_record) VALUES ($1, $2, $3, $4) RETURNING *';
            
            // Assuming `db` is your database client instance from pg-promise or similar library
            const insertedData = await db.one(insertQuery, [Data_id, username, password_hash, update_record]);
            
            res.json(insertedData);
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.put('/UpdateAccountData/:user_id', async (req, res) => {
        const { user_id } = req.params; // รับ user_id จากพารามิเตอร์ URL
        const { username, password_hash , update_record} = req.body; // รับข้อมูลที่อัปเดตจาก body
    
        try {
            // ตรวจสอบว่ามีบัญชีอยู่แล้วหรือไม่
            const account = await db.oneOrNone('SELECT * FROM account WHERE user_id = $1', [user_id]);
    
            if (account) {
                // ถ้ามีบัญชีอยู่แล้ว, อัปเดตมัน
                const updateQuery = 'UPDATE account SET username = $1, password_hash = $2 ,update_record = $3 WHERE user_id = $4 RETURNING *';
                const updatedData = await db.one(updateQuery, [username, password_hash, update_record, user_id]);
                res.json(updatedData);
            } else {
                // ถ้าไม่พบบัญชี, ส่งคำตอบแจ้งผู้ใช้
                res.status(404).json({ error: 'Account not found' });
            }
        } catch (error) {
            console.error('Error handling account data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    router.get('/fetchAccountDataById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM account WHERE Data_id = $1';
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
