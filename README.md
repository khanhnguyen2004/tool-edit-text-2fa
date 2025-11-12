

npm install
npm run dev

# 🛠️ Danh Sách Công Cụ Online

## 📋 Danh Sách Công Cụ

### 1. 🍪 Cookie
Xử lý và định dạng cookie strings

### 2. ⏰ Pomodoro
Quản lý thời gian với kỹ thuật Pomodoro

### 3. ✍️ Edit Text
Chỉnh sửa và xử lý văn bản đa năng

### 4. 📅 UID → Created Year
Chuyển đổi UID sang năm tạo

### 5. ✂️ Cắt Chuỗi
Cắt và xử lý chuỗi ký tự

### 6. 📏 Cắt Line
Cắt và chia nhỏ các dòng text

### 7. 🔗 Ghép dòng
Ghép nối các dòng text

### 8. 🔁 Trùng lặp
Xử lý và tìm các phần tử trùng lặp

### 9. 🔄 Đảo từ
Đảo ngược thứ tự từ trong chuỗi

### 10. ➕ Ghép Chuỗi
Ghép nối các chuỗi ký tự

### 11. 🧩 Chia cắt dòng
Chia cắt dòng text theo quy tắc

### 12. 🔍 Lọc Chuỗi
Lọc và tìm kiếm trong chuỗi

### 13. 🔤 Lọc Chữ
Lọc các ký tự theo điều kiện

### 14. 📋 Copy file
Sao chép nội dung file

### 15. 🖼️ Ảnh html
Chuyển đổi ảnh sang HTML

### 16. 🌐 Link html
Xử lý và tạo link HTML

### 17. 📊 Lọc CSV
Lọc và xử lý file CSV

### 18. 📎 Ghép file
Ghép nối nhiều file

### 19. 💾 JSON
Xử lý và format JSON

### 20. 🏷️ Lọc tag
Lọc và xử lý HTML tags

### 21. 📺 Tính Sub
Tính toán thời gian subtitle

### 22. 🔠 Join chữ
Ghép nối các ký tự

### 23. 👤 Account
Quản lý tài khoản

### 24. 📝 Loại text
Phân loại và xử lý text

### 25. 🔗 Fb link
Xử lý Facebook links

---

## 🎨 Đặc điểm giao diện
- Thiết kế hiện đại, thân thiện
- Màu sắc pastel dịu mắt
- Icon rõ ràng cho từng công cụ
- Responsive trên mọi thiết bị
- Hiệu ứng hover mượt mà

---

## 🎨 Hệ Thống Màu Sắc (HSL Format)

### Light Mode
| Thành phần | Mã màu HSL | Mô tả |
|------------|------------|-------|
| `--background` | `210 20% 98%` | Nền chính - xám sáng tinh tế |
| `--foreground` | `215 20% 25%` | Chữ chính - xám đậm dễ đọc |
| `--primary` | `199 89% 48%` | Màu chủ đạo - xanh sky đẹp mắt |
| `--primary-foreground` | `0 0% 100%` | Chữ trên nền primary - trắng |
| `--accent` | `199 95% 94%` | Màu nhấn - xanh pastel nhạt |
| `--accent-foreground` | `199 89% 48%` | Chữ trên nền accent - xanh sky |
| `--muted` | `210 40% 96.1%` | Màu mờ - xám rất nhạt |
| `--muted-foreground` | `215 16% 47%` | Chữ phụ - xám trung bình |
| `--border` | `214 32% 91%` | Viền - xám nhạt tinh tế |
| `--sidebar-background` | `210 20% 98%` | Nền sidebar - xám sáng |
| `--sidebar-accent` | `199 95% 94%` | Active state - xanh pastel |
| `--sidebar-accent-foreground` | `199 89% 48%` | Chữ khi active - xanh sky |

### Dark Mode
| Thành phần | Mã màu HSL | Mô tả |
|------------|------------|-------|
| `--background` | `222 47% 11%` | Nền chính - xanh đen đậm |
| `--foreground` | `210 40% 98%` | Chữ chính - trắng gần như tinh khiết |
| `--primary` | `199 89% 48%` | Màu chủ đạo - xanh sky (giữ nguyên) |
| `--sidebar-background` | `222 47% 11%` | Nền sidebar - xanh đen đậm |
| `--sidebar-accent` | `217 33% 18%` | Active state - xanh đen nhạt hơn |

---

## 🔤 Font Chữ & Typography

### Font Family
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
             sans-serif;
```
**Lý do sử dụng System Font:**
- Tải nhanh hơn (không cần download font)
- Hiển thị tự nhiên trên mỗi hệ điều hành
- Tối ưu cho khả năng đọc
- Phù hợp với thiết kế modern và clean

### Font Weights
- **Semibold (600)**: Tiêu đề sidebar "Tool Online"
- **Medium (500)**: Menu item khi active
- **Regular (400)**: Menu items thông thường
- **Normal**: Văn bản mô tả

### Font Sizes
- **Heading (text-lg)**: 1.125rem / 18px - Tiêu đề sidebar
- **Labels (text-xs)**: 0.75rem / 12px - Group labels
- **Menu Items**: Default size - Menu navigation

---

## ✨ Hiệu Ứng & Animations

### Transition Effects
```css
--transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```
**Cubic-bezier easing**: Tạo chuyển động mượt mà, tự nhiên

### Border Radius
```css
--radius: 0.75rem; /* 12px - bo góc lớn, hiện đại */
```
- `rounded-lg`: 12px - Các card và container chính
- `rounded-md`: 10px - Menu items
- `rounded-sm`: 8px - Các element nhỏ

### Hover Effects (Sidebar Menu)
```css
hover:bg-sidebar-accent 
hover:text-sidebar-accent-foreground
transition-colors
```
- **Background**: Chuyển sang xanh pastel nhạt `#E0F2FE` khi hover
- **Text color**: Chuyển sang xanh sky `#0EA5E9`
- **Duration**: 200ms với easing mượt mà
- **Cursor**: `cursor-pointer` hiển thị tay

### Active State
```css
bg-sidebar-accent 
text-sidebar-accent-foreground 
font-medium
```
- **Background solid**: Xanh pastel `#E0F2FE`
- **Text color**: Xanh sky đậm `#0EA5E9`
- **Font weight**: Medium (500) để nổi bật

### Accordion Animation
```javascript
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out"
}
```
- **Duration**: 200ms
- **Easing**: ease-out cho cảm giác tự nhiên

### Shadow Effects
```css
/* Subtle shadows cho depth */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
```

---

## 🎯 Design Philosophy

### Lovable Aesthetic
- **Minimalist**: Giao diện gọn gàng, không rối mắt
- **Friendly**: Màu sắc dịu nhẹ, không gay gắt
- **Professional**: Cân đối giữa thẩm mỹ và chức năng
- **Cozy**: Tạo cảm giác thoải mái khi sử dụng

### Color Psychology
- **Xanh Sky**: Tin cậy, chuyên nghiệp, hiện đại
- **Xám Nhạt**: Trung lập, thanh lịch, dễ nhìn
- **Pastel**: Dịu mắt, thân thiện, không gây mỏi

### Interaction Design
- **Feedback rõ ràng**: Hover và active states dễ nhận biết
- **Smooth transitions**: Không có chuyển động giật lag
- **Visual hierarchy**: Dễ quét nhanh và tìm công cụ
- **Accessibility**: Contrast ratio đạt chuẩn WCAG

---

## 📐 Layout & Spacing

### Sidebar Dimensions
- **Full width**: `w-64` (256px)
- **Collapsed width**: `w-14` (56px) - chỉ hiển thị icons
- **Padding**: `px-4` horizontal, `py-5` cho header
- **Gap between items**: `gap-1` (4px)

### Menu Item Height
```css
h-10 /* 40px - đủ lớn cho touch và dễ click */
```

### Icon Sizes
```css
h-4 w-4 /* 16px - rõ ràng nhưng không lấn át */
```

---

## 🔧 Technical Implementation

### CSS Variables Approach
Sử dụng CSS custom properties cho:
- **Themeable**: Dễ dàng switch light/dark mode
- **Maintainable**: Thay đổi một chỗ, áp dụng toàn bộ
- **Scalable**: Thêm variants mới không ảnh hưởng code cũ

### Semantic Tokens
Không dùng màu trực tiếp (`bg-blue-500`) mà dùng semantic tokens (`bg-primary`):
- Dễ hiểu ý nghĩa
- Tự động adapt với theme
- Consistent trên toàn app

