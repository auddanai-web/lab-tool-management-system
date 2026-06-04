# Database Schema

## Tools

| Column | Description |
|---|---|
| ToolID | รหัสเครื่องมือ เช่น EQ-0001 |
| Asset Number | เลขครุภัณฑ์ |
| ToolName | ชื่อภาษาอังกฤษ |
| ToolThaiName | ชื่อภาษาไทย |
| Category | หมวดหมู่ |
| Brand | ยี่ห้อ |
| Model | รุ่น |
| SerialNo | Serial number |
| ImageFileID | Google Drive File ID ของรูป |
| ManualFileID | Google Drive File ID ของคู่มือหรือเอกสาร |
| Installation Date | วันที่ติดตั้ง |
| Location | สถานที่จัดเก็บ |
| Calibration | TRUE / FALSE |
| Preventive Maintenance | TRUE / FALSE |
| ResponsiblePerson | ผู้รับผิดชอบ |
| Service Provider | ผู้ให้บริการ |
| Status | พร้อมใช้งาน / ซ่อมบำรุง / เลิกใช้งาน |
| Note | หมายเหตุ |
| CreatedAt | วันที่สร้าง |
| UpdatedAt | วันที่แก้ไขล่าสุด |

## ServiceRecords

| Column | Description |
|---|---|
| RecordID | รหัสรายการ เช่น SR-0001 |
| DateTime | วันเวลา ที่ดำเนินการ |
| ToolID | รหัสเครื่องมือ |
| ToolName | ชื่อเครื่องมือ |
| WorkType | Maintenance / Repair / Calibration / Verification / Other |
| ProblemReason | ปัญหาที่พบ/เหตุผล |
| ActionDetail | รายละเอียดการดำเนินการ |
| PerformedBy | ผู้ดำเนินการ |
| InspectionResult | ผ่าน / ไม่ผ่าน |
| ReturnDateTime | วัน เวลา ที่กลับมาใช้งาน |
| DocumentFileID | Google Drive File ID ของเอกสารแนบ |
| RecordedBy | ผู้บันทึก |
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
