# Changelog

## v1.0.7 - 2026-06-05

- เปลี่ยนเมนูเป็น `รายการบันทึกการซ่อมบำรุงและการสอบเทียบ`
- เปลี่ยนฟอร์มบันทึกงานซ่อมบำรุง/สอบเทียบให้เปิดเป็น popup เหมือนการเพิ่มเครื่องมือ
- เพิ่มตารางรายการบันทึกด้านล่าง พร้อมช่องค้นหา ตัวกรองเครื่องมือ และตัวกรองประเภทงาน
- เปลี่ยนประเภทงานจาก `PM` เป็น `Maintenance`
- ถอดคอลัมน์ `Asset Number` ออกจาก `ServiceRecords`
- ย่อ icon ที่ฝังใน `Index.html` ให้เป็น SVG data URL เพื่อให้ไฟล์เล็กลงและดูแลต่อได้ง่ายขึ้น

## v1.0.6 - 2026-06-05

- รวม `MaintenanceRecords` และ `CalibrationRecords` เป็นตาราง `ServiceRecords`
- เพิ่ม `getServiceRecords` และ `addServiceRecord` ใน `Code.gs`
- ให้สร้างชีต `ServiceRecords` พร้อมหัวคอลัมน์อัตโนมัติเมื่อยังไม่มี

## v1.0.5 - 2026-06-04

- เปลี่ยนการแนบรูป/คู่มือจาก file upload เป็นการวาง Google Drive link หรือ File ID
- เพิ่มตัวแยก Google Drive File ID จากลิงก์อัตโนมัติ
- ลดความเสี่ยง timeout จากการอัปโหลดไฟล์ผ่าน Apps Script

## v1.0.4 - 2026-06-04

- ปรับตารางรายการเครื่องมือให้แสดงชื่อเป็น `ชื่อภาษาไทย (ชื่อภาษาอังกฤษ)`
- เพิ่มคอลัมน์รูปเครื่องมือในตาราง
- เพิ่ม modal สำหรับดูรูปเครื่องมือจาก Google Drive

## v1.0.3 - 2026-06-04

- เพิ่มช่อง `ImageFileID` และ `ManualFileID`
- รองรับ Settings keys `TOOL_IMAGE_FOLDER_ID` และ `MANUAL_FOLDER_ID`

## v1.0.2 - 2026-06-04

- เปลี่ยน `Calibration` และ `Preventive Maintenance` ในฟอร์มเครื่องมือเป็น checkbox
- บันทึกค่า checkbox เป็น `TRUE` / `FALSE`
- เพิ่มคอลัมน์ Cal และ PM ในตารางรายการเครื่องมือ

## v1.0.1 - 2026-06-04

- ปรับ `Code.gs` และ `Index.html` ให้ตรงกับ Google Sheet schema ใหม่
- เพิ่ม field `Asset Number`, `ToolThaiName`, `Installation Date`, `Calibration`, `Preventive Maintenance`, `Service Provider`

## v1.0.0 - 2026-06-04

- สร้างระบบเริ่มต้นสำหรับ Google Apps Script Web App
- เพิ่ม dashboard สรุปสถานะเครื่องมือ
- เพิ่มหน้ารายการเครื่องมือ
- เพิ่มฟอร์มเพิ่มและแก้ไขเครื่องมือ
- เพิ่มฟอร์มบันทึกซ่อมบำรุงและสอบเทียบ
- เพิ่มเอกสารโครงสร้างฐานข้อมูล
