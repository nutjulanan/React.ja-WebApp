module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    const multer = require('multer');
    router.use(express.urlencoded({ extended: true }));
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // เพิ่มข้อมูล

    router.post('/Addcar_receiptdata', async (req, res) => {
        try {
            const { customer_id, job_id, estimated_cost, receipt_status, reception_date,  update_record } = req.body;
            const query = `
                INSERT INTO car_receipt (customer_id, job_id, estimated_cost,receipt_status, reception_date, update_record)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *; 
            `;
            const values = [customer_id, job_id, estimated_cost, receipt_status, reception_date, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newcar_receipt = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newcar_receipt);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new car_receipt:', err);
            res.status(500).send('Server error');
        }
    });

    
    router.put('/Updatecar_receipt/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { customer_id, job_id, estimated_cost, receipt_status, reception_date,  update_record} = req.body;
            const query = `
                UPDATE car_receipt SET customer_id = $1, job_id = $2, estimated_cost = $3, receipt_status = $4, reception_date = $5, update_record = $6, updated_at = CURRENT_TIMESTAMP
                WHERE id = $7
                RETURNING *;
            `;
            const values = [customer_id, job_id, estimated_cost, receipt_status, reception_date,  update_record, id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedcar_receipt = await db.oneOrNone(query, values);
            
            if (updatedcar_receipt) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedcar_receipt);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('car_receipt not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating car_receipt:', err);
            res.status(500).send('Server error');
        }
    });


    router.delete('/deletecar_receipt/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM car_receipt WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllcar_receipt', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM car_receipt');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllcar_receiptById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM car_receipt WHERE id = $1';
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


    router.get('/fetchAllcar_receiptByjob_id/:jobId', async (req, res) => {
        const { jobId } = req.params;
        try {
            const carReceipts = await db.any('SELECT * FROM car_receipt WHERE job_id = $1', jobId);
            if (carReceipts.length > 0) {
                res.status(200).json(carReceipts);
            } else {
                res.status(404).send('No car receipts found for the provided job ID.');
            }
        } catch (error) {
            console.error('Error fetching car receipts:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    router.put('/car_receipts/:id/picture', upload.single('picture'), (req, res) => {
        const id = parseInt(req.params.id);
        const picture = req.file ? req.file.buffer : null; // req.file.buffer contains the file data if a file was uploaded
    
        db.none('UPDATE car_receipt SET picture = $1 WHERE id = $2', [picture, id])
            .then(() => {
                res.json({ message: "Car Receipt Picture Updated Successfully" });
            })
            .catch(error => {
                res.status(500).json({ error: error.toString() });
            });
    });

    router.get('/car_receipts/:id/picture', (req, res) => {
        const id = parseInt(req.params.id);
    
        db.one('SELECT picture FROM car_receipt WHERE id = $1', id)
            .then(data => {
                if (!data.picture) {
                    return res.status(404).send('No picture found.');
                }
    
                // Assuming the picture is stored as a buffer in the database
                const imgBuffer = data.picture;
    
                // Set the correct content-type
                res.set('Content-Type', 'image/jpeg'); // Adjust this according to your image format, e.g., 'image/png' if necessary
                res.send(imgBuffer);
            })
            .catch(error => {
                console.error('Error retrieving picture:', error);
                res.status(500).json({ error: error.toString() });
            });
    });
    
    




    return router;
};
