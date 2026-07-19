# Mệnh Đồ AI

Trang lập lá số Tử Vi Đẩu Số chạy hoàn toàn trong trình duyệt, theo nguyên tắc:

> Soi sáng, không gieo sợ hãi; không gây hại cho mình, người và muôn loài.

## Bộ máy hiện có

- Đổi Dương lịch ↔ Âm lịch Việt Nam (UTC+7), hỗ trợ tháng nhuận.
- Can Chi năm, tháng, ngày và giờ; ngũ hành nạp âm; Mệnh, Thân và Cục.
- 12 cung, 14 chính tinh, các vòng sao và phụ tinh, Tứ Hóa, Tuần/Triệt.
- Đại hạn và luận giải ngắn có nêu rõ cung/sao làm căn cứ.
- Dữ liệu ngày sinh chỉ được xử lý trên thiết bị.

## Trải nghiệm tương tác

- Trợ lý ngữ cảnh chào người dùng và giải thích từng trường dữ liệu.
- Hiểu các câu hỏi đời thường như công việc, tình cảm, tiền bạc, gia đình,
  sức khỏe và đưa người dùng đến đúng cung.
- Có thể chạm từng cung, từng sao để xem giải nghĩa ngay trong ngữ cảnh.
- Đọc sâu đủ 12 cung với điểm nâng đỡ, điều cần quan sát, câu hỏi soi chiếu
  và căn cứ kỹ thuật.
- Lọc nhóm sao, lưu lá số trên thiết bị và sao chép tóm tắt.

## Chạy và kiểm thử

Phải phục vụ qua HTTP vì JavaScript dùng ES module:

```bash
python3 -m http.server 8000
node test-engine.mjs
```

Mở `http://localhost:8000` trong trình duyệt. Xem nguồn và giấy phép ở
`THIRD_PARTY_NOTICES.md`.
