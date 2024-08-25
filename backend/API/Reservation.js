module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/AddReservationdata', async (req, res) => {
        try {
            const { fullname, E_mail, tele_number , date, WorkdayStatus, response_details, reservation_type, details , status, update_record} = req.body;
            const query = `
                INSERT INTO reservation (fullname, E_mail, tele_number, date, WorkdayStatus, response_details, reservation_type, details ,status, update_record)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *; 
            `;
            const values = [fullname, E_mail,tele_number, date, WorkdayStatus, response_details, reservation_type, details ,status, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newReservation = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newReservation);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new Reservation:', err);
            res.status(500).send('Server error');
        }
    });

    router.put('/UpdateReservation/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { fullname, E_mail,  tele_number , date, WorkdayStatus, response_details, reservation_type, details ,status, update_record} = req.body;
            const query = `
                UPDATE reservation SET fullname = $1, E_mail = $2, tele_number = $3, date = $4, WorkdayStatus = $5, response_details = $6, reservation_type = $7 , details = $8 , status = $9, update_record = $10, updated_at = CURRENT_TIMESTAMP
                WHERE id = $11
                RETURNING *;
            `;
            const values = [fullname, E_mail,  tele_number , date, WorkdayStatus, response_details, reservation_type, details ,status, update_record, id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedReservation = await db.oneOrNone(query, values);
            
            if (updatedReservation) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedReservation);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('reservation not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating reservation:', err);
            res.status(500).send('Server error');
        }
    });

    router.delete('/deleteReservation/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM reservation WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllReservation', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM reservation');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllReservationById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM reservation WHERE id = $1';
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

    router.get('/check_reservation/:data', async (req, res) => {
        const data = req.params.data; // Assuming the data is passed as a query parameter
    
        try {
            const query = `SELECT * FROM reservation WHERE E_mail = $1 OR tele_number = $1`;
            const result = await db.any(query, [data]);
    
            if (result.length > 0) {
                res.status(200).json({ success: true, message: "Match found", data: result });
            } else {
                res.status(404).json({ success: false, message: "No match found" });
            }
        } catch (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });
    
    
    return router;
};
