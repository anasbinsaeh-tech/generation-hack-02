# Mobile Sidebar Navigation

## สิ่งที่จะทำ

เปลี่ยนเมนูนำทางบนมือถือจากแถบ nav ด้านบน เป็น **sidebar เลื่อนเข้าจากด้านซ้าย** (drawer) โดย:

1. **ปุ่ม Hamburger** — เพิ่มปุ่มไอคอนเมนู (Menu icon) ที่มุมซ้ายของ TopNav แสดงเฉพาะบนจอมือถือ (`< sm`)
2. **Sidebar Drawer** — กดแล้วเปิด panel เลื่อนเข้าจากซ้าย ประกอบด้วย:
   - โลโก้ Skilleveling ด้านบน
   - ลิงก์เมนู: Dashboard, Opportunities, Employer Demo (ไฮไลต์หน้าปัจจุบัน)
   - ปุ่มสลับภาษา EN/ไทย ด้านล่าง
   - พื้นหลังมืดโปร่ง (backdrop) กดเพื่อปิด + ปุ่ม X ปิด
3. **Animation** — เลื่อนเข้า/ออกนุ่มนวล (slide + fade)
4. **Desktop ไม่เปลี่ยน** — จอ `sm:` ขึ้นไปยังแสดง nav bar แนวนอนเหมือนเดิม

## ขอบเขตไฟล์

- แก้เฉพาะ `src/components/siuuu.tsx` (TopNav) — ใช้ state เปิด/ปิด + fixed overlay panel (ไม่ต้องติดตั้งไลบรารีเพิ่ม)
- ใช้คำแปลจาก `src/lib/translations.ts` ที่มีอยู่แล้ว
