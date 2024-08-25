module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    const multer = require('multer');
    router.use(express.urlencoded({ extended: true }));
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // เพิ่มข้อมูล

    router.post('/Addquotationdata', async (req, res) => {
        try {
            const { customer_id, job_id, quotation_date, total_amount, details,  update_record } = req.body;
            const query = `
                INSERT INTO quotation (customer_id, job_id, quotation_date,total_amount, details, update_record)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *; 
            `;
            const values = [customer_id, job_id, quotation_date, total_amount, details, update_record];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newquotation = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newquotation);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new quotation:', err);
            res.status(500).send('Server error');
        }
    });

    router.put('/Updatequotation/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { customer_id, job_id, quotation_date, details,  update_record} = req.body;
            const query = `
                UPDATE quotation SET customer_id = $1, job_id = $2, quotation_date = $3, details = $4, update_record = $5, updated_at = CURRENT_TIMESTAMP
                WHERE id = $6
                RETURNING *;
            `;
            const values = [customer_id, job_id, quotation_date, details,  update_record, id];
            
            // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
            const updatedquotation = await db.oneOrNone(query, values);
            
            if (updatedquotation) {
                // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
                res.status(200).json(updatedquotation);
            } else {
                // ไม่พบลูกค้าด้วย ID ที่ให้มา
                res.status(404).send('quotation not found');
            }
        } catch (err) {
            // จัดการกับข้อผิดพลาด
            console.error('Error updating quotation:', err);
            res.status(500).send('Server error');
        }
    });
    
    
    router.delete('/deletequotation/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM quotation WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllquotation', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM quotation');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllquotationById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM quotation WHERE id = $1';
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

    router.get('/quotations/:jobId', async (req, res) => {
        const { jobId } = req.params;
        try {
            const quotations = await db.any('SELECT * FROM quotation WHERE job_id = $1', jobId);
            if (quotations.length > 0) {
                res.status(200).json(quotations);
            } else {
                res.status(404).send('Quotations not found for the provided job ID.');
            }
        } catch (error) {
            console.error('Error fetching quotations:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.put('/quotations/:id/picture', upload.single('picture'), (req, res) => {
        const id = parseInt(req.params.id);
        const picture = req.file ? req.file.buffer : null; // Access the file data if a file was uploaded
    
        db.none('UPDATE quotation SET picture = $1 WHERE id = $2', [picture, id])
            .then(() => {
                res.json({ message: "Quotation Picture Updated Successfully" });
            })
            .catch(error => {
                console.error('Error updating quotation picture:', error);
                res.status(500).json({ error: error.toString() });
            });
    });

    // Endpoint to get the picture for a specific quotation
    router.get('/quotations/:id/picture', (req, res) => {
        const id = parseInt(req.params.id);

        db.one('SELECT picture FROM quotation WHERE id = $1', id)
            .then(data => {
                if (!data.picture) {
                    return res.status(404).send('No picture found.');
                }

                const imgBuffer = data.picture;
                res.set('Content-Type', 'image/jpeg'); // Adjust based on your image's format
                res.send(imgBuffer);
            })
            .catch(error => {
                console.error('Error retrieving quotation picture:', error);
                res.status(500).json({ error: error.toString() });
            });
    });


    return router;
};
