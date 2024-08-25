module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    
    router.post('/bill_quotation', (req, res) => {
        const { bill_id, quotation_id } = req.body;
    
        db.none('INSERT INTO bill_quotation (bill_id, quotation_id) VALUES ($1, $2)', [bill_id, quotation_id])
            .then(() => {
                res.json({ message: "Bill-Quotation Relationship Added Successfully" });
            })
            .catch(error => {
                console.error('Error adding bill-quotation relationship:', error);
                res.status(500).json({ error: error.toString() });
            });
    });

    // DELETE endpoint to remove a bill-quotation relationship
    router.delete('/bill_quotation/:bill_id/:quotation_id', (req, res) => {
        const { bill_id, quotation_id } = req.params;

        db.none('DELETE FROM bill_quotation WHERE bill_id = $1 AND quotation_id = $2', [bill_id, quotation_id])
            .then(() => {
                res.json({ message: "Bill-Quotation Relationship Deleted Successfully" });
            })
            .catch(error => {
                console.error('Error deleting bill-quotation relationship:', error);
                res.status(500).json({ error: error.toString() });
            });
    });

    // GET endpoint to retrieve all quotations for a specific bill
    router.get('/bill_quotation/bill/:bill_id', (req, res) => {
        const { bill_id } = req.params;

        db.any('SELECT * FROM bill_quotation WHERE bill_id = $1', bill_id)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.error('Error retrieving bill-quotation relationships:', error);
                res.status(500).json({ error: error.toString() });
            });
    });

    return router;
};
