# Mệnh Đồ AI

**Mã quản trị:** `APP-TV-001`<br>
**Phiên bản:** `v1.5 Public Beta`<br>
**Bản công khai:** https://menh-do-ai.vercel.app

Trang lập lá số Tử Vi Đẩu Số chạy hoàn toàn trong trình duyệt, theo nguyên tắc:

> Soi sáng, không gieo sợ hãi; không gây hại cho mình, người và muôn loài.

## Bộ máy hiện có

- Đổi Dương lịch ↔ Âm lịch Việt Nam (UTC+7), hỗ trợ tháng nhuận.
- Can Chi năm, tháng, ngày và giờ; ngũ hành nạp âm; Mệnh, Thân và Cục.
- 12 cung, 14 chính tinh, các vòng sao và phụ tinh, Tứ Hóa, Tuần/Triệt.
- Đại hạn và luận giải ngắn có nêu rõ cung/sao làm căn cứ.
- Dữ liệu ngày sinh chỉ được xử lý trên thiết bị.

## Trải nghiệm tương tác

- “Tổng quan 60 giây” nêu cốt lõi, Thân cư, hướng tạo giá trị, cách quản trị
  nguồn lực và chỉ rõ nơi nên xem tiếp.
- Trợ lý ngữ cảnh chào người dùng và giải thích từng trường dữ liệu.
- Hiểu các câu hỏi đời thường như công việc, tình cảm, tiền bạc, gia đình,
  sức khỏe; tách được câu hỏi có nhiều chủ đề và đưa người dùng đến đúng cung.
- Lưu mạch hỏi–đáp gần nhất, có câu hỏi tiếp nối và phản hồi “Hữu ích/Chưa rõ”.
- Có thể chạm từng cung, từng sao để xem giải nghĩa ngay trong ngữ cảnh.
- Đọc sâu đủ 12 cung với điểm nâng đỡ, điều cần quan sát, câu hỏi soi chiếu
  và căn cứ kỹ thuật.
- Mỗi lần xem cung hoặc sao đều có “Kết luận hành động”: nên tiến từng bước,
  chưa nên quyết vội hoặc cần điều chỉnh trước; kèm việc làm cụ thể và cách
  kiểm chứng lại bằng thực tế.
- Lọc nhóm sao, lưu/xóa dữ liệu trên thiết bị, sao chép tóm tắt và chia sẻ
  đường dẫn công khai mà không gắn ngày sinh vào URL.

## Chuẩn public beta 9,5

Điểm 9,5 dùng cho chất lượng trải nghiệm public beta: đúng cấu trúc kỹ thuật
trong phạm vi bộ kiểm thử, dễ bắt đầu, chạm đâu có phản hồi, có căn cứ, an
toàn, bảo vệ dữ liệu và dùng được trên desktop/mobile. Điểm này không có nghĩa
là một nền tảng thương mại đã hoàn tất hoặc là công cụ dự đoán khoa học.

## Chạy và kiểm thử

Phải phục vụ qua HTTP vì JavaScript dùng ES module:

```bash
python3 -m http.server 8000
node test-engine.mjs
```

Mở `http://localhost:8000` trong trình duyệt. Xem nguồn và giấy phép ở
`THIRD_PARTY_NOTICES.md`.
