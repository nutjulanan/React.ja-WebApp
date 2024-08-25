module.exports = function(db) {
    const express = require('express');
    const router = express.Router();

    router.get('/jobData', async (req, res) => {
        try {
            const data = await db.any('SELECT * FROM public.job');
            res.json(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    return router;
};
