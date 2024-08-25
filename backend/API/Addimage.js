const multer = require('multer');

const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

const upload = multer({ storage: storage });

module.exports = function(db) {
    const express = require('express');
    const router = express.Router();

    // Upload image
    // router.post('/upload', upload.single('image'), async (req, res) => {
    //     try {
    //         const file = await fs.promises.readFile(req.file.path);

    //         const result = await db.one('INSERT INTO image_table (image_name, image_data) VALUES ($1, $2) RETURNING *', [req.file.filename, file]);
    //         res.status(201).json(result);
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send('Server Error');
    //     } finally {
    //         fs.unlinkSync(req.file.path); // Delete file after upload
    //     }
    // });

    const tableName = 'ServiceRepairInfo';
    const idColumn = 'id';
    const nameColumn = 'name';
    const infoColumn = 'Info';
    const imageDataColumn = 'img_service';
    const lastModifiedColumn = 'last_modified';

    router.post('/upload', upload.single('image'), async (req, res) => {
        try {
            const file = await fs.promises.readFile(req.file.path);
    
            const insertQuery = `
                INSERT INTO ${tableName} (${nameColumn}, ${infoColumn}, ${imageDataColumn}, ${lastModifiedColumn})
                VALUES ($1, $2, $3, current_timestamp)
                RETURNING ${idColumn}
            `;
            
            // const result = await db.one(insertQuery, [req.file.filename, req.body.info, file]);
            const result = await db.one(insertQuery, [req.body.name, req.body.info, file]);
    
            res.status(201).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        } finally {
            fs.unlinkSync(req.file.path); // ลบไฟล์หลังจากอัพโหลด
        }
    });
    

    // // Download image
    // // router.get('/image/:id', async (req, res) => {
    // //     try {
    // //         const { id } = req.params;
    // //         const image = await db.one('SELECT * FROM image_table WHERE id = $1', [id]);
    // //         res.set('Content-Type', 'image/jpeg');
    // //         res.send(image.image_data);
    // //     } catch (err) {
    // //         console.error(err);
    // //         res.status(500).send('Server Error');
    // //     }
    // // });

    // router.get('/image/:id', async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const selectQuery = `SELECT ${imageDataColumn} FROM ${tableName} WHERE ${idColumn} = $1`;
    //         const image = await db.one(selectQuery, [id]);
            
    //         res.set('Content-Type', 'image/jpeg'); // ปรับ Content-Type ตามประเภทของภาพที่คุณเก็บ
    //         res.send(image[imageDataColumn]);
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send('Server Error');
    //     }
    // });


    router.get('/image/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // ถ้าต้องการดึงข้อมูลทั้งหมด ใช้ * แทนที่จะใช้ ${imageDataColumn} เพื่อเลือกทุก columns
            const selectQuery = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
            const data = await db.one(selectQuery, [id]);
    
            // ส่งข้อมูลทั้งหมดกลับไปเป็น JSON
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });
    
    router.put('/update/:id', upload.single('image'), async (req, res) => {
        try {
            const { id } = req.params; // ดึง ID จากพารามิเตอร์ URL
    
            // อ่านไฟล์ที่มีอยู่หากมีการอัปโหลดรูปภาพใหม่
            let file;
            if (req.file) { file = await fs.promises.readFile(req.file.path); }
    
            // สร้างคำสั่งอัปเดตโดยอัตโนมัติตามฟิลด์ที่ให้มา
            let updateQuery = `UPDATE ${tableName} SET `;
            const updateFields = [];
            const queryParams = [];
    
            if (req.body.name) {
                updateFields.push(`${nameColumn} = $${updateFields.length + 1}`);
                queryParams.push(req.body.name);
            }
    
            if (req.body.info) {
                updateFields.push(`${infoColumn} = $${updateFields.length + 1}`);
                queryParams.push(req.body.info);
            }
    
            if (file) {
                updateFields.push(`${imageDataColumn} = $${updateFields.length + 1}`);
                queryParams.push(file);
            }
    
            updateFields.push(`${lastModifiedColumn} = current_timestamp`);
    
            updateQuery += updateFields.join(', ');
            updateQuery += ` WHERE ${idColumn} = $${updateFields.length} RETURNING *`;
    
            queryParams.push(id);
    
            if (queryParams.length === 1) { // ถ้ามีแค่ ID ที่ให้มา, ไม่มีฟิลด์ที่จะอัปเดต
                return res.status(400).send('ไม่มีฟิลด์ที่จะอัปเดต');
            }
    
            const result = await db.one(updateQuery, queryParams);
    
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('เกิดข้อผิดพลาดของเซิร์ฟเวอร์');
        } finally {
            if (req.file) {
                // ลบไฟล์ที่อัปโหลดหลังจากดำเนินการ
                fs.unlinkSync(req.file.path);
            }
        }
    });
    
    

    return router;
};
