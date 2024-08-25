module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    const multer = require('multer');
    router.use(express.urlencoded({ extended: true }));
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // เพิ่มข้อมูล

    router.post('/Addbilldata', async (req, res) => {
        try {
            const { job_id, customer_id, item_details, tax_amount, discount_amount, total_amount, payment_method, payment_status, bill_date, update_record } = req.body;
            const query = `
                INSERT INTO bill (job_id, customer_id, item_details,tax_amount, discount_amount, total_amount, payment_method, payment_status, bill_date, update_record)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *; 
            `;
            const values = [job_id, customer_id, item_details, tax_amount, discount_amount, total_amount, payment_method, payment_status, bill_date, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newbill = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newbill);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new bill:', err);
            res.status(500).send('Server error');
        }
    });


    router.delete('/deletebill/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM bill WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllbill', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM bill');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllbillById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM bill WHERE id = $1';
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

    router.get('/bills/job/:jobId', (req, res) => {
        const jobId = parseInt(req.params.jobId);
    
        db.any('SELECT * FROM bill WHERE job_id = $1', jobId)
            .then(bills => {
                if (bills.length > 0) {
                    res.status(200).json(bills);
                } else {
                    res.status(404).send('No bills found for the provided job ID.');
                }
            })
            .catch(error => {
                console.error('Error fetching bills:', error);
                res.status(500).send('Internal Server Error');
            });
    });

    

    router.put('/bills/:id/picture', upload.single('picture'), (req, res) => {
        const id = parseInt(req.params.id);
        const picture = req.file ? req.file.buffer : null; // Access the file data if a file was uploaded
    
        db.none('UPDATE bill SET picture = $1 WHERE id = $2', [picture, id])
            .then(() => {
                res.json({ message: "Bill Picture Updated Successfully" });
            })
            .catch(error => {
                console.error('Error updating bill picture:', error);
                res.status(500).json({ error: error.toString() });
            });
    });
    // GET endpoint to retrieve the picture for a specific bill
    router.get('/bills/:id/picture', (req, res) => {
        const id = parseInt(req.params.id);

        db.one('SELECT picture FROM bill WHERE id = $1', id)
            .then(data => {
                if (!data.picture) {
                    return res.status(404).send('No picture found.');
                }

                const imgBuffer = data.picture;
                res.set('Content-Type', 'image/jpeg'); // Adjust based on your image's format
                res.send(imgBuffer);
            })
            .catch(error => {
                console.error('Error retrieving bill picture:', error);
                res.status(500).json({ error: error.toString() });
            });
    });

    return router;
};
