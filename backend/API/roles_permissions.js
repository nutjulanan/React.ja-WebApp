module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    // เพิ่มข้อมูล
    router.post('/Addroles_permissions', async (req, res) => {
        const { name_role, inventorystock, job, carandcustomer, quotations, requisitions, vehiclereceipts, repairappointments, garages, update_record } = req.body;
        try {
            await db.none('INSERT INTO roles_permissions(name_role, inventorystock, job, carandcustomer, quotations, requisitions, vehiclereceipts, repairappointments, garages, update_record) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [name_role, inventorystock, job, carandcustomer, quotations, requisitions, vehiclereceipts, repairappointments, garages, update_record]);
            res.status(201).send(`Role added with Name: ${name_role}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error adding new role');
        }
    });
    
    // GET - Read all roles_permissions
    router.get('/roles_permissions', async (req, res) => {
        try {
            const result = await db.any('SELECT * FROM roles_permissions');
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving roles');
        }
    });

    router.get('/fetchroles_permissionsById/:id', async (req, res) => {
        const id = req.params.id; // รับค่า id จาก URL
        try {
            const query = 'SELECT * FROM roles_permissions WHERE id = $1';
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
    
    // PUT - Update a role_permission
    router.put('/updatroles_permissions/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const { name_role, inventorystock, job, carandcustomer, quotations, requisitions, vehiclereceipts, repairappointments, garages, update_record } = req.body;
        try {
            await db.none('UPDATE roles_permissions SET name_role = $1, inventorystock = $2, job = $3, carandcustomer = $4, quotations = $5, requisitions = $6, vehiclereceipts = $7, repairappointments = $8, garages = $9, update_record = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11', [name_role, inventorystock, job, carandcustomer, quotations, requisitions, vehiclereceipts, repairappointments, garages, update_record, id]);
            res.status(200).send(`Role updated with ID: ${id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating role');
        }
    });
    
    // DELETE - Delete a role_permission
    router.delete('/Deleteroles_permissions/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            await db.none('DELETE FROM roles_permissions WHERE id = $1', [id]);
            res.status(200).send(`Role deleted with ID: ${id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting role');
        }
    });

    return router;
};
