module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/Addcustomerdata', async (req, res) => {
        try {
            const { national_id , nameprefix, full_name, sex, birth_date, tele_number, E_mail, address, detail, update_record } = req.body;
            const query = `
                INSERT INTO customer (national_id , nameprefix, full_name, sex, birth_date, tele_number, E_mail, address, detail, update_record)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *; 
            `;
            const values = [national_id , nameprefix, full_name, sex, birth_date, tele_number, E_mail, address, detail, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newCustomer = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newCustomer);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new customer:', err);
            res.status(500).send('Server error');
        }
    });

    router.put('/Updatecustomer/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { national_id , nameprefix, full_name, sex, birth_date, tele_number, E_mail, address, detail, update_record } = req.body;
            const query = `
                UPDATE customer SET national_id = $1, nameprefix = $2, full_name = $3, sex = $4, birth_date = $5, tele_number = $6, E_mail = $7, address = $8, detail = $9, update_record = $10, updated_at = CURRENT_TIMESTAMP
                WHERE id = $11
                RETURNING *;
            `;
            const values = [national_id , nameprefix, full_name, sex, birth_date, tele_number, E_mail, address, detail, update_record, id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedCustomer = await db.oneOrNone(query, values);
            
            if (updatedCustomer) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedCustomer);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('Customer not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating customer:', err);
            res.status(500).send('Server error');
        }
    });
    

    // Route สำหรับดึงข้อมูลทั้งหมด
    router.get('/fetchAllcustomer', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM customer');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllcustomerById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM customer WHERE id = $1';
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

    router.delete('/deleteCustomer/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM customer WHERE id = $1 RETURNING *;`;
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


    return router;
};
