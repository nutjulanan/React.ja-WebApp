module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    router.get('/weekly_schedule/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const schedule = await db.one('SELECT * FROM WeeklySchedule WHERE id = $1', [id]);
            res.status(200).json(schedule);
        } catch (error) {
            res.status(404).json({ message: "Schedule not found" });
        }
    });
    
    // PUT route to update a weekly schedule by ID
    router.put('/weekly_schedule/:id', async (req, res) => {
        const id = req.params.id;
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, update_record } = req.body;
        try {
            await db.none('UPDATE WeeklySchedule SET monday = $1, tuesday = $2, wednesday = $3, thursday = $4, friday = $5, saturday = $6, sunday = $7, update_record = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9', [monday, tuesday, wednesday, thursday, friday, saturday, sunday, update_record, id]);
            res.status(200).json({ message: "Schedule updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating schedule" });
        }
    });
    return router;
};
