$ErrorActionPreference = "Stop"
$word = $null
$doc  = $null

try {
    $outputPath = "C:\Users\patta\Desktop\BMS\docs\ใบเก็บความต้องการโปรเจกต์.docx"
    $FONT = "TH Sarabun New"

    $word = New-Object -ComObject Word.Application
    $word.Visible      = $false
    $word.DisplayAlerts = 0

    $doc = $word.Documents.Add()    $doc.PageSetup.TopMargin    = $word.CentimetersToPoints(2.5)
    $doc.PageSetup.BottomMargin = $word.CentimetersToPoints(2.5)
    $doc.PageSetup.LeftMargin   = $word.CentimetersToPoints(3.0)
    $doc.PageSetup.RightMargin  = $word.CentimetersToPoints(2.0)

    # --- WP: Write paragraph ---
    function WP {
        param([string]$text="",[int]$fs=16,[bool]$b=$false,[bool]$i=$false)
        $s = $word.Selection
        $s.Font.Name   = $FONT
        $s.Font.Size   = $fs
        $s.Font.Bold   = $b
        $s.Font.Italic = $i
        if ($text) { $s.TypeText($text) }
        $s.TypeParagraph()
        $s.Font.Bold   = $false
        $s.Font.Italic = $false
    }

    # --- WC: Checkbox item ---
    function WC {
        param([string]$text)
        $s = $word.Selection
        $s.Font.Name  = $FONT
        $s.Font.Size  = 16
        $s.Font.Bold  = $false
        $s.ParagraphFormat.LeftIndent = $word.CentimetersToPoints(0.5)
        $s.TypeText([char]0x2610 + "  " + $text)
        $s.TypeParagraph()
        $s.ParagraphFormat.LeftIndent = 0
    }

    # --- WH: Section heading ---
    function WH {
        param([string]$text,[int]$fs=18)
        $s = $word.Selection
        $s.ParagraphFormat.SpaceBefore = $word.CentimetersToPoints(0.4)
        $s.Font.Name = $FONT
        $s.Font.Size = $fs
        $s.Font.Bold = $true
        $s.TypeText($text)
        $s.TypeParagraph()
        $s.Font.Bold = $false
        $s.ParagraphFormat.SpaceBefore = 0
    }

    # --- WT: Insert table ---
    function WT {
        param([string[]]$hdrs,[object[]]$rows,[double[]]$widths)
        $s   = $word.Selection
        $nc  = $hdrs.Length
        $nr  = 1 + $rows.Length
        $tbl = $doc.Tables.Add($s.Range, $nr, $nc)
        $tbl.Borders.Enable  = $true
        $tbl.AllowAutoFit    = $false

        for ($c = 0; $c -lt $nc; $c++) {
            $tbl.Columns($c+1).Width = $word.CentimetersToPoints($widths[$c])
            $cell = $tbl.Cell(1,$c+1)
            $cell.Range.Text          = $hdrs[$c]
            $cell.Range.Font.Name     = $FONT
            $cell.Range.Font.Size     = 16
            $cell.Range.Font.Bold     = $true
            $cell.Shading.BackgroundPatternColorIndex = 15
        }

        for ($r = 0; $r -lt $rows.Length; $r++) {
            $rd = $rows[$r]
            for ($c = 0; $c -lt $rd.Length; $c++) {
                $cell = $tbl.Cell($r+2,$c+1)
                $cell.Range.Text      = $rd[$c]
                $cell.Range.Font.Name = $FONT
                $cell.Range.Font.Size = 16
            }
        }

        $tbl.Range.InsertParagraphAfter()
        $doc.Range($tbl.Range.End, $tbl.Range.End).Select()
    }

    # ============================================================
    # CONTENT
    # ============================================================

    WP "ใบเก็บความต้องการโปรเจกต์ (Requirement Sheet)" -fs 24 -b $true
    WP ""

    WH "ข้อมูลโปรเจกต์"
    WT @("หัวข้อ","รายละเอียด") @(
        @("ชื่อโปรเจกต์",""),
        @("วันที่กรอกข้อมูล",""),
        @("ผู้ประสานงานฝั่งลูกค้า",""),
        @("เบอร์โทร / อีเมล",""),
        @("ผู้รับงาน (Developer)","")
    ) @(6.0,10.0)
    WP ""

    WH "1. วัตถุประสงค์"
    WP "เว็บนี้ทำขึ้นเพื่ออะไร? แก้ปัญหาอะไร?" -b $true
    WP "________________________________________________________________________"
    WP "________________________________________________________________________"
    WP ""
    WP "ตอนนี้ใช้ระบบอะไรอยู่? (ถ้ามี)" -b $true
    WP "________________________________________________________________________"
    WP ""

    WH "2. กลุ่มผู้ใช้งาน"
    WT @("กลุ่ม","จำนวน (โดยประมาณ)","ใช้ผ่าน","หมายเหตุ") @(
        @("ตัวอย่าง: พนักงาน","50 คน","PC","ใช้ในออฟฟิศ"),
        @("","","PC / Mobile / ทั้งคู่",""),
        @("","","PC / Mobile / ทั้งคู่",""),
        @("","","PC / Mobile / ทั้งคู่","")
    ) @(4.0,4.0,4.0,4.0)
    WP "จำนวน User ใช้พร้อมกันสูงสุด (Concurrent): ประมาณ __________ คน"
    WP ""

    WH "3. ระดับสิทธิ์ (User Roles)"
    WT @("Role","สิ่งที่ทำได้","สิ่งที่ทำไม่ได้") @(
        @("ตัวอย่าง: Admin","ทุกอย่าง","—"),
        @("","",""),
        @("","",""),
        @("","","")
    ) @(4.0,7.0,5.0)
    WP ""

    WH "4. หน้าและฟีเจอร์ที่ต้องการ"
    WP "4.1 รายการหน้า (Pages)" -fs 17 -b $true
    WT @("ลำดับ","ชื่อหน้า","คำอธิบาย","สร้าง","แก้ไข","ลบ","ดูอย่างเดียว") @(
        @("1","หน้า Login","เข้าสู่ระบบ","","","","✓"),
        @("2","","","","","",""),
        @("3","","","","","",""),
        @("4","","","","","",""),
        @("5","","","","","",""),
        @("6","","","","","",""),
        @("7","","","","","",""),
        @("8","","","","","","")
    ) @(1.5,3.5,4.5,1.5,1.5,1.5,2.0)
    WP ""

    WP "4.2 ฟีเจอร์พิเศษ (ทำเครื่องหมาย ✓ ที่ต้องการ)" -fs 17 -b $true
    WT @("ฟีเจอร์","ต้องการ","หมายเหตุ") @(
        @("Dashboard / กราฟ / Chart","",""),
        @("Export Excel (.xlsx)","",""),
        @("Export PDF","",""),
        @("Upload ไฟล์ / รูปภาพ","",""),
        @("Notification / แจ้งเตือน","",""),
        @("Search / Filter","",""),
        @("Real-time update","",""),
        @("ระบบ Chat","",""),
        @("ชำระเงิน / Payment","",""),
        @("ส่ง Email อัตโนมัติ","",""),
        @("ส่ง SMS อัตโนมัติ","",""),
        @("Audit Log / ประวัติการแก้ไข","",""),
        @("รองรับหลายภาษา","",""),
        @("อื่นๆ:","","")
    ) @(7.0,2.5,6.5)
    WP ""

    WH "5. ข้อมูลและ Database"
    WP "ข้อมูลหลักที่ต้องจัดเก็บ:" -b $true
    WP "ตัวอย่าง: ข้อมูลลูกค้า, ข้อมูลสินค้า, ออเดอร์, ใบแจ้งหนี้" -i $true
    WP "________________________________________________________________________"
    WP "________________________________________________________________________"
    WP ""
    WP "มีข้อมูลเดิมที่ต้อง import เข้าระบบใหม่ไหม?" -b $true
    WC "ไม่มี"
    WC "มี — รูปแบบข้อมูลเดิม: ________________  จำนวนโดยประมาณ: ________________"
    WP ""
    WP "ต้องเชื่อมต่อกับระบบภายนอกไหม?" -b $true
    WC "ไม่มี"
    WC "มี — ระบุ: ________________________________________________________________"
    WP ""

    WH "6. Design & UX"
    WP "มี Design / Figma / Mockup แล้วหรือยัง?" -b $true
    WC "มีแล้ว (แนบไฟล์มาด้วย)"
    WC "ยังไม่มี ให้ทีม Developer ออกแบบให้ด้วย"
    WC "มีตัวอย่างที่อยากให้เหมือน — URL: ________________________________"
    WP ""
    WP "ภาษาของระบบ:" -b $true
    WC "ภาษาไทย"
    WC "ภาษาอังกฤษ"
    WC "หลายภาษา (ระบุ): ________________"
    WP ""
    WP "อุปกรณ์หลักที่ใช้งาน:" -b $true
    WC "PC / Desktop เป็นหลัก"
    WC "มือถือเป็นหลัก"
    WC "ต้องใช้ได้ดีทั้งสองแบบ"
    WP ""
    WP "มี Brand Guideline / สี / Logo ที่ต้องใช้?" -b $true
    WC "มี (แนบไฟล์มาด้วย)"
    WC "ไม่มี ให้ทีม Developer กำหนดให้"
    WP ""

    WH "7. Technical Requirements"
    WP "Hosting / Server:" -b $true
    WC "ให้ทีม Developer จัดให้"
    WC "มีของตัวเอง — ระบุ: ________________________________"
    WC "Cloud ที่ต้องการ: AWS / GCP / Azure / อื่นๆ: ________________"
    WP ""
    WP "Domain:" -b $true
    WC "มีแล้ว: ________________________________"
    WC "ยังไม่มี ให้จัดให้"
    WP ""
    WP "เทคโนโลยีที่บริษัทกำหนด (ถ้ามี):" -b $true
    WP "________________________________________________________________________"
    WP ""
    WP "ความปลอดภัยพิเศษที่ต้องการ:" -b $true
    WC "Two-Factor Authentication (2FA)"
    WC "Single Sign-On (SSO)"
    WC "มาตรฐาน ISO / PDPA Compliance"
    WC "อื่นๆ: ________________________________"
    WP ""

    WH "8. Timeline"
    WT @("Milestone","วันที่ต้องการ") @(
        @("เริ่มโปรเจกต์",""),
        @("ส่ง Design / Prototype",""),
        @("ทดสอบระบบ (UAT)",""),
        @("เปิดใช้งานจริง (Go-live)","")
    ) @(8.0,8.0)
    WP "มี Event / วันสำคัญที่กำหนดตายตัวไหม?" -b $true
    WP "________________________________________________________________________"
    WP ""

    WH "9. งบประมาณ"
    WC "มีงบประมาณกรอบไว้แล้ว — ประมาณ: ________________ บาท"
    WC "ยังไม่มี ขอให้ทีม Developer ประเมินมาก่อน"
    WP ""
    WP "ต้องการ Maintenance / Support หลัง Go-live ไหม?" -b $true
    WC "ไม่ต้องการ"
    WC "ต้องการ — ลักษณะงาน: ________________________________"
    WP ""

    WH "10. หมายเหตุเพิ่มเติม"
    WP "________________________________________________________________________"
    WP "________________________________________________________________________"
    WP "________________________________________________________________________"
    WP ""

    WH "ลายเซ็นยืนยัน"
    WP "การลงนามในเอกสารนี้ถือว่าเห็นชอบข้อมูลข้างต้น"
    WP ""
    WT @("","ฝั่งลูกค้า","ฝั่ง Developer") @(
        @("ชื่อ","",""),
        @("ตำแหน่ง","",""),
        @("ลายเซ็น","",""),
        @("วันที่","","")
    ) @(3.0,6.5,6.5)
    WP ""
    WP "เอกสารนี้ใช้สำหรับรวบรวมความต้องการเบื้องต้น ก่อนจัดทำใบเสนอราคาและ Scope of Work อย่างเป็นทางการ" -fs 14 -i $true

    # Save
    $doc.SaveAs2($outputPath, 16)
    $doc.Close($false)
    $doc = $null
    Write-Output "OK: $outputPath"
}
catch {
    Write-Output "ERROR: $_"
}
finally {
    if ($doc  -ne $null) { try { $doc.Close($false)  } catch {} }
    if ($word -ne $null) { try { $word.Quit(); [void][System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) } catch {} }
}
