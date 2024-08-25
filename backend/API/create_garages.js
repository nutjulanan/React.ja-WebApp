module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    router.use(express.urlencoded({ extended: true }));
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // เพิ่มข้อมูล
    router.get('/garage/:garage_id', async (req, res) => {
        try {
            const garage_id = parseInt(req.params.garage_id);
            const garage = await db.oneOrNone('SELECT * FROM Garages WHERE garage_id = $1', garage_id);
            if (garage) {
                res.json(garage);
            } else {
                res.status(404).send('Garage not found');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });
    
     // PUT update garage details
     router.put('/garages/:id', upload.single('logo_img'), (req, res) => {
        const id = parseInt(req.params.id);
        const { garage_name, garageowner_id, tin, telephone_number, address, email, line_id, workinghours, detail_garages, update_record } = req.body;
        const logo_img = req.file ? req.file.buffer : null; // req.file.buffer contains the file data if a file was uploaded
    
        db.none('UPDATE Garages SET garage_name = $1, garageowner_id = $2, tin = $3, telephone_number = $4, address = $5, email = $6, line_id = $7, workinghours = $8, logo_img = $9, detail_garages = $10, update_record = $11 WHERE garage_id = $12',
            [garage_name, garageowner_id, tin, telephone_number, address, email, line_id, workinghours, logo_img, detail_garages, update_record, id])
            .then(() => {
                res.json({ message: "Garage Updated Successfully" });
            })
            .catch(error => {
                res.status(500).json({ error: error.toString() });
            });
    });
    
    router.get('/garages/:id/logo', (req, res) => {
        const id = parseInt(req.params.id);
        db.one('SELECT logo_img FROM Garages WHERE garage_id = $1', id)
            .then(data => {
                if (data.logo_img) {
                    const imgBuffer = Buffer.from(data.logo_img, 'binary');
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg', // Adjust this content-type based on the actual image format (e.g., image/png)
                        'Content-Length': imgBuffer.length
                    });
                    res.end(imgBuffer);
                } else {
                    res.status(404).json({ message: "Logo not found" });
                }
            })
            .catch(error => {
                console.error('Error fetching logo:', error);
                res.status(500).json({ error: error.toString() });
            });
    });
    

      

    return router;
};
