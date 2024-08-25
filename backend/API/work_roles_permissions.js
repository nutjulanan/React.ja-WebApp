module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    // เพิ่มข้อมูล
    // GET all records
    router.get('/work_roles_permissions', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM Work_roles_permissions');
            res.json(data);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // GET a single record by Workforce_id
    router.get('/work_roles_permissions/:Workforce_id', async (req, res) => {
        try {
            const { Workforce_id } = req.params;
            const data = await db.any('SELECT * FROM Work_roles_permissions WHERE Workforce_id = $1', Workforce_id);
            if (data) {
                res.json(data);
            } else {
                res.status(404).send('Role not found');
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new record
    router.post('/Addwork_roles_permissions', async (req, res) => {
        try {
            const { role_id, Workforce_id, update_record } = req.body;
            await db.none('INSERT INTO Work_roles_permissions (role_id, Workforce_id, update_record) VALUES ($1, $2, $3)', [role_id, Workforce_id, update_record]);
            res.status(201).send('Record created successfully');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // PUT to update a record
    router.put('/work_roles_permissions/:role_id', async (req, res) => {
        try {
            const { role_id } = req.params;
            const { Workforce_id, update_record } = req.body;
            await db.none('UPDATE Work_roles_permissions SET Workforce_id = $1, update_record = $2, updated_at = NOW() WHERE role_id = $3', [Workforce_id, update_record, role_id]);
            res.send('Record updated successfully');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE a record
    router.delete('/deleteWorkRolePermission/:roleId/:workforceId', async (req, res) => {
        const { roleId, workforceId } = req.params;
      
        try {
          const result = await db.result(
            'DELETE FROM Work_roles_permissions WHERE role_id = $1 AND Workforce_id = $2',
            [roleId, workforceId]
          );
      
          if (result.rowCount > 0) {
            res.status(200).json({ message: 'Record deleted successfully' });
          } else {
            res.status(404).json({ message: 'Record not found' });
          }
        } catch (error) {
          console.error('Error deleting record:', error);
          res.status(500).json({ message: 'Error deleting record' });
        }
      });


    return router;
};
