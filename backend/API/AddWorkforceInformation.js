const multer = require("multer");

const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ตำแหน่งที่จะเก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่เพื่อไม่ให้ชื่อซ้ำกัน
  },
});

const upload = multer({ storage: storage });

module.exports = function (db) {
  const express = require("express");
  const router = express.Router();

  router.post("/AddWorkforceInformation", async (req, res) => {
    try {
      const {
        national_id,
        nameprefix,
        full_name,
        age,
        sex,
        email,
        telephone_number,
        secondarycontact,
        address,
        jobexperience,
        salary,
        totalvacationdays,
        start_work_date,
        end_of_work_day,
        update_record,
      } = req.body;
      const query = `
                INSERT INTO WorkforceInformation (national_id, nameprefix, full_name, age, sex, email, telephone_number, secondarycontact, address, jobexperience, salary, totalvacationdays, start_work_date, end_of_work_day ,  update_record )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11, $12, $13, $14, $15)
                RETURNING *; 
            `;
      const values = [
        national_id,
        nameprefix,
        full_name,
        age,
        sex,
        email,
        telephone_number,
        secondarycontact,
        address,
        jobexperience,
        salary,
        totalvacationdays,
        start_work_date,
        end_of_work_day,
        update_record,
      ];

      // ใช้ pg-promise สำหรับการเพิ่มข้อมูลลูกค้าใหม่
      const newWorkforceInformation = await db.one(query, values);

      // ส่งกลับข้อมูลลูกค้าที่เพิ่มเข้าไปพร้อมกับสถานะ 201
      res.status(201).json(newWorkforceInformation);
    } catch (err) {
      // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบถ้วน, ฐานข้อมูลล้มเหลว)
      console.error("Error adding new WorkforceInformation:", err);
      res.status(500).send("Server error");
    }
  });

  router.put("/UpdateWorkforceInformationdata/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const {
        national_id,
        nameprefix,
        full_name,
        age,
        sex,
        email,
        telephone_number,
        secondarycontact,
        address,
        jobexperience,
        salary,
        totalvacationdays,
        start_work_date,
        end_of_work_day,
        update_record,
      } = req.body;
      const query = `
                UPDATE WorkforceInformation SET national_id = $1, nameprefix = $2, full_name = $3, age = $4, sex = $5, email = $6, telephone_number = $7, secondarycontact = $8, address = $9, jobexperience  = $10, salary = $11, totalvacationdays  = $12, start_work_date = $13, end_of_work_day = $14,  update_record =$15,  updated_at = CURRENT_TIMESTAMP
                WHERE id  = $16
                RETURNING *;
            `;
      const values = [
        national_id,
        nameprefix,
        full_name,
        age,
        sex,
        email,
        telephone_number,
        secondarycontact,
        address,
        jobexperience,
        salary,
        totalvacationdays,
        start_work_date,
        end_of_work_day,
        update_record,
        id,
      ];

      // ใช้ pg-promise สำหรับการอัพเดทข้อมูลลูกค้า
      const updatedWorkforceInformation = await db.oneOrNone(query, values);

      if (updatedWorkforceInformation) {
        // ส่งกลับข้อมูลลูกค้าที่อัพเดทพร้อมกับสถานะ 200
        res.status(200).json(updatedWorkforceInformation);
      } else {
        // ไม่พบลูกค้าด้วย ID ที่ให้มา
        res.status(404).send("WorkforceInformation not found");
      }
    } catch (err) {
      // จัดการกับข้อผิดพลาด
      console.error("Error updating WorkforceInformation:", err);
      res.status(500).send("Server error");
    }
  });

  // Route สำหรับดึงข้อมูลทั้งหมด
  router.get("/fetchAllWorkforceInformation", async (req, res) => {
    try {
      const data = await db.any("SELECT * FROM WorkforceInformation");
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  router.get("/fetchWorkforceInformationById/:id", async (req, res) => {
    const id = req.params.id; // รับค่า id จาก URL
    try {
      const query = "SELECT * FROM WorkforceInformation WHERE id = $1";
      const data = await db.oneOrNone(query, [id]); // ใช้ oneOrNone ในกรณีที่อาจไม่มีข้อมูลตรงกับ id ที่ระบุ
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).send("Data not found"); // ส่งข้อความ "Data not found" ถ้าไม่มีข้อมูล
      }
    } catch (err) {
      console.error("Error fetching data by id:", err);
      res.status(500).send("Server Error");
    }
  });

  router.delete("/deleteWorkforceInformation/:id", async (req, res) => {
    const { id } = req.params; // รับ ID จาก path parameter

    try {
      // สร้างคำสั่ง SQL สำหรับลบข้อมูล
      const query = `DELETE FROM WorkforceInformation WHERE id = $1 RETURNING *;`;
      const deletedData = await db.oneOrNone(query, [id]);

      if (deletedData) {
        res
          .status(200)
          .json({ message: "Data deleted successfully", deletedData });
      } else {
        res.status(404).send("Data not found or already deleted");
      }
    } catch (err) {
      console.error("Error deleting data:", err);
      res.status(500).send("Server Error");
    }
  });

  return router;
};
