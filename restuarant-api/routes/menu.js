var express = require("express");
var router = express.Router();
const multer = require('multer');
const path = require('path');
var config = require("../config/dbconfig");
const sql = require("mssql");

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'menu-images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage
});

// Endpoint สำหรับการดึงข้อมูลเมนูทั้งหมด
router.get("/getAllMenu", async function (req, res, next) {
  try {
    await sql.connect(config);
    const result = await sql.query `SELECT * from tbl_menu`;
    await sql.close();
    return res.status(200).json({
      data: result.recordset
    });
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(500).json({
      message: "Database connection error",
      error: err
    });
  }
});

// Endpoint สำหรับการดึงข้อมูลเมนูตาม ID
router.get("/getMenu/:id", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM tbl_menu WHERE id = @id");
    return res.status(200).json({
      data: result.recordset
    });
  } catch (err) {
    console.error("Error fetching menu:", err);
    return res.status(500).json({
      message: "Error fetching menu",
      error: err
    });
  }
});

// Endpoint สำหรับการเพิ่มเมนูใหม่
router.post("/addMenu", upload.single('image'), async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("name", sql.VarChar, req.body.name)
      .input("price", sql.Decimal, req.body.price)
      .input("description", sql.VarChar, req.body.description)
      .input("image", sql.VarChar, req.file ? req.file.filename : null)
      .input("imagePath", sql.VarChar, req.file ? req.file.path : null)
      .query(
        "INSERT INTO tbl_menu (name, price, description, menu_image, menu_image_path, menu_status) VALUES (@name, @price, @description, @image, @imagePath, 1)"
      );
    return res.status(200).json({
      message: "Menu added successfully",
      data: result
    });
  } catch (err) {
    console.error("Error adding menu:", err);
    return res.status(500).json({
      message: "Error adding menu",
      error: err
    });
  }
});

// Endpoint สำหรับการอัปเดตเมนู
router.put("/updateMenu/:id", upload.single('image'), async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let query = "UPDATE tbl_menu SET name = @name, price = @price, description = @description";
    if (req.file) {
      query += ", menu_image = @image, menu_image_path = @imagePath";
    }
    query += " WHERE id = @id";

    let request = pool.request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.VarChar, req.body.name)
      .input("price", sql.Decimal, req.body.price)
      .input("description", sql.VarChar, req.body.description);

    if (req.file) {
      request.input("image", sql.VarChar, req.file.filename)
             .input("imagePath", sql.VarChar, req.file.path);
    }

    let result = await request.query(query);
    return res.status(200).json({
      message: "Menu updated successfully",
      data: result
    });
  } catch (err) {
    console.error("Error updating menu:", err);
    return res.status(500).json({
      message: "Error updating menu",
      error: err
    });
  }
});

// Endpoint สำหรับการลบเมนู
router.delete("/deleteMenu/:id", async function (req, res, next) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM tbl_menu WHERE id = @id");
    return res.status(200).json({
      message: "Menu deleted successfully",
      data: result
    });
  } catch (err) {
    console.error("Error deleting menu:", err);
    return res.status(500).json({
      message: "Error deleting menu",
      error: err
    });
  }
});

module.exports = router;
