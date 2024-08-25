module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    

    // เพิ่มข้อมูล

    router.post('/Addquotation_partdata', async (req, res) => {
        try {
            const { part_id, quotation_id, quantity, line_total } = req.body;
            const query = `
                INSERT INTO quotation_part (part_id, quotation_id, quantity, line_total)
                VALUES ($1, $2, $3, $4)
                RETURNING *; 
            `;
            const values = [part_id, quotation_id, quantity, line_total];
            
            // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
            const newquotation_part = await db.one(query, values);
            
            // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
            res.status(201).json(newquotation_part);
        } catch (err) {
            // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
            console.error('Error adding new quotation_part:', err);
            res.status(500).send('Server error');
        }
    });

    

    router.delete('/deletequotation_part/:id', async (req, res) => {
        const { id } = req.params; // รับ ID จาก path parameter
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูล
            const query = `DELETE FROM quotation_part WHERE id = $1 RETURNING *;`;
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
    router.get('/fetchAllquotation_part', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM quotation_part');
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    router.get('/fetchAllquotation_partById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM quotation_part WHERE id = $1';
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


    // Assuming express and db are already set up as per previous examples

    // GET API endpoint to fetch quotation parts by quotation_id
    router.get('/quotation_parts/:quotationId', async (req, res) => {
        const { quotationId } = req.params;
        try {
            const quotationParts = await db.any('SELECT * FROM quotation_part WHERE quotation_id = $1', quotationId);
            if (quotationParts.length > 0) {
                res.status(200).json(quotationParts);
            } else {
                res.status(404).send('Quotation parts not found for the provided quotation ID.');
            }
        } catch (error) {
            console.error('Error fetching quotation parts:', error);
            res.status(500).send('Internal Server Error');
        }
    });


    return router;
};
