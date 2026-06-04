# Lab Tool Management System

ระบบจัดการเครื่องมือห้องปฏิบัติการด้วย Google Apps Script, Google Sheets และ Google Drive

## Version

v1.0.7

## Features

- Dashboard สรุปจำนวนและสถานะเครื่องมือ
- รายการเครื่องมือ พร้อมเพิ่มและแก้ไขข้อมูลผ่าน popup
- เก็บรูป คู่มือ และเอกสารแนบด้วย Google Drive File ID
- รายการบันทึกการซ่อมบำรุงและการสอบเทียบในตาราง `ServiceRecords`
- Popup สำหรับบันทึกงาน Maintenance, Repair, Calibration, Verification และ Other
- ค้นหาและกรองรายการบันทึกตามเครื่องมือและประเภทงาน

## Files

- `Code.gs` - โค้ดหลักฝั่ง Google Apps Script
- `Index.html` - หน้า dashboard และแบบฟอร์ม
- `database-schema.md` - โครงสร้าง Google Sheet
- `CHANGELOG.md` - ประวัติการเปลี่ยนแปลง

## Google Sheet Tabs

- Tools
- ServiceRecords
- Categories
- Locations
- Users
- Settings

## Deployment

1. เปิด Google Sheet
2. ไปที่ Extensions > Apps Script
3. วาง `Code.gs`
4. สร้าง HTML file ชื่อ `Index` แล้ววาง `Index.html`
5. Run function `doGet` เพื่ออนุญาตสิทธิ์
6. Deploy > New deployment > Web app

## Notes

ไม่ควรเก็บข้อมูลลับ เช่น Sheet ID, Folder ID, email ส่วนตัว หรือเอกสารจริงใน repo สาธารณะ
