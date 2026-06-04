# Database Schema

## Tools

| Column | Description |
|---|---|
| ToolID | รหัสเครื่องมือ เช่น EQ-0001 |
| ToolName | ชื่อเครื่องมือ |
| Category | หมวดหมู่ |
| Brand | ยี่ห้อ |
| Model | รุ่น |
| SerialNo | Serial number |
| Location | สถานที่จัดเก็บ |
| Status | พร้อมใช้งาน / ซ่อมบำรุง / เลิกใช้งาน |
| ResponsiblePerson | ผู้รับผิดชอบ |
| PurchaseDate | วันที่ซื้อ |
| WarrantyExpireDate | วันหมดประกัน |
| ImageFileID | Google Drive File ID ของรูป |
| ManualFileID | Google Drive File ID ของคู่มือ |
| Note | หมายเหตุ |
| CreatedAt | วันที่สร้าง |
| UpdatedAt | วันที่แก้ไขล่าสุด |

## MaintenanceRecords

| Column | Description |
|---|---|
| MaintenanceID | รหัสรายการซ่อมบำรุง เช่น MT-0001 |
| ToolID | รหัสเครื่องมือ |
| Date | วันที่ซ่อมบำรุง |
| Type | ตรวจเช็ก / ซ่อม / บำรุงรักษา |
| Description | รายละเอียด |
| Cost | ค่าใช้จ่าย |
| Vendor | ผู้ให้บริการหรือบริษัท |
| NextMaintenanceDate | กำหนดซ่อมบำรุงครั้งถัดไป |
| FileID | Google Drive File ID ของเอกสาร |
| CreatedAt | วันที่สร้างรายการ |

## CalibrationRecords

| Column | Description |
|---|---|
| CalibrationID | รหัสรายการสอบเทียบ เช่น CAL-0001 |
| ToolID | รหัสเครื่องมือ |
| CalibrationDate | วันที่สอบเทียบ |
| ExpireDate | วันหมดอายุ |
| Result | Pass / Fail |
| CertificateNo | เลขที่ใบรับรอง |
| CertificateFileID | Google Drive File ID ของใบรับรอง |
| CalibratedBy | หน่วยงานสอบเทียบ |
| CreatedAt | วันที่สร้างรายการ |

## Categories

| Column | Description |
|---|---|
| CategoryID | รหัสหมวดหมู่ |
| CategoryName | ชื่อหมวดหมู่ |
| Description | รายละเอียด |
| Active | TRUE / FALSE |

## Locations

| Column | Description |
|---|---|
| LocationID | รหัสสถานที่ |
| LocationName | ชื่อสถานที่ |
| Description | รายละเอียด |
| Active | TRUE / FALSE |

## Users

| Column | Description |
|---|---|
| UserID | รหัสผู้ใช้ |
| Name | ชื่อ |
| Email | อีเมล |
| Role | Admin / Staff / Viewer |
| Department | หน่วยงาน |
| Active | TRUE / FALSE |

## Settings

| Column | Description |
|---|---|
| Key | ชื่อตัวแปร |
| Value | ค่า |
| Description | คำอธิบาย |
