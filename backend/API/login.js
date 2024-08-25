module.exports = function(db) {
    const express = require('express');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const router = express.Router();

    require('dotenv').config();
    const JWT_SECRET = process.env.JWT_SECRET;

    router.post('/login', async (req, res) => {
        const { username, password_hash } = req.body;

        
        try {
            const selectQuery = 'SELECT * FROM account WHERE username = $1';
            const accountData = await db.oneOrNone(selectQuery, [username]);
            

            if (!accountData)  {
                return res.status(404).json({ message: 'Owner not found' });
            }
    
            // ตรวจสอบรหัสผ่าน (สมมติว่ารหัสผ่านเก็บเป็น plain text ในตัวอย่างนี้)
            // ในกรณีจริงควรใช้ bcrypt.compare สำหรับตรวจสอบ hash
            if (password_hash != accountData.password_hash) { // ในตัวอย่างนี้เปรียบเทียบ plain text, ควรใช้ bcrypt.compare
                const updateAttemptsQuery = 'UPDATE account SET login_attempts = login_attempts + 1 WHERE username = $1';
                await db.none(updateAttemptsQuery, [username]); // อัพเดท login_attempts
                return res.status(400).json({ message: 'Invalid password' });
            }
    
            // รหัสผ่านถูกต้อง, สร้าง token
            const token = jwt.sign(
                { account_id: accountData.user_id, username: accountData.username, data_id: accountData.data_id },
                JWT_SECRET,
                { expiresIn: '3h' }
            );
    
            // ส่ง token และข้อมูลบางส่วนของ accountData กลับไป (ไม่รวม password_hash)
            const { password_hash: _, ...userDetails } = accountData; // ลบ password_hash ออกจาก object ที่จะส่งกลับ
            res.json({ token, user: userDetails });
    
        } catch (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    
    

    return router;
};
