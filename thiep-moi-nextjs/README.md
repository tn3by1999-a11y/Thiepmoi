# Thiếp Mời Dự Yến · team Designẻ

Thiệp mời phong cách Hậu cung Chân Hoàn truyện, viết bằng Next.js (App Router).

## Chạy thử trên máy

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Đưa lên Vercel

**Cách 1 · qua GitHub (khuyên dùng)**
1. Đẩy thư mục này lên một repo GitHub.
2. Vào vercel.com → *Add New… → Project* → chọn repo → *Deploy*. Không cần chỉnh gì thêm.

**Cách 2 · qua CLI**
```bash
npm i -g vercel
vercel        # lần đầu: làm theo hướng dẫn
vercel --prod
```

## Về nút "Phúc Đáp"

Không cần cơ sở dữ liệu. Khi nhập tên và bấm xác nhận, tên hiện ngay bên dưới nút.
Danh sách được lưu trong trình duyệt của người đang xem (localStorage), nên người khác
mở link sẽ không thấy tên bạn vừa nhập. Muốn mọi người thấy chung một danh sách thì cần
thêm một nơi lưu dữ liệu (Redis, Google Sheets...).

## Chỉnh nội dung

- Lời mời, giờ giấc, địa chỉ: `app/page.js`
- Giao diện: `app/globals.css`
- Ảnh thumbnail khi chia sẻ link: `app/opengraph-image.png` và `app/twitter-image.png` (1200×630)
- Tiêu đề, mô tả: `app/layout.js`
