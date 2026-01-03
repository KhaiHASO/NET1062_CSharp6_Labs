# ShopeeDemo API (Phiên bản .NET 10)

Đây là project Web API minh họa hệ thống sản phẩm biến thể (Product Variants) giống Shopee, được xây dựng bằng ASP.NET Core và Entity Framework Core (Code First). Project này tập trung vào khả năng tùy biến thứ tự hiển thị (Display Order) của các biến thể (Ví dụ: Kéo Size M lên trước Size S).

## Tính năng
- **EF Core Code First**: Tạo database tự động từ model.
- **Quan hệ Nhiều-Nhiều**: Mapping phức tạp giữa Sản phẩm con (SKU) và Thuộc tính (Option) thông qua bảng `ProductConfiguration`.
- **Dữ liệu mẫu (Seed Data)**: Tự động tạo sản phẩm "Áo Thun Polo" với Màu (Đỏ, Xanh) và Size (S, M).
- **Tùy chỉnh thứ tự (Display Order)**: API cho phép thay đổi thứ tự hiển thị của các thuộc tính mà không cần sửa cấu trúc SKU.

## Cấu trúc dữ liệu & Giải thuật "Display Order"

### 1. Bản chất dữ liệu (Database Schema)
Bảng `VariationOptions` được thêm cột `DisplayOrder` để lưu vị trí.

```sql
CREATE TABLE VariationOptions (
    id INT PRIMARY KEY,
    variation_id INT, -- FK: Nhóm (Màu, Size)
    value NVARCHAR(50), -- VD: "Đỏ", "S", "M"
    display_order INT DEFAULT 0 -- Thứ tự hiển thị
);
```

### 2. Kịch bản thay đổi thứ tự
Khi người dùng kéo thả trên giao diện (ví dụ: Kéo Size M lên trước Size S), Frontend gửi danh sách ID theo thứ tự mới về Backend.

- **API Reorder**: `POST /api/variations/options/reorder`
- **Body**: `[202, 201]` (Trong đó 202 là ID của M, 201 là ID của S).
- **Backend xử lý**:
  ```sql
  UPDATE VariationOptions SET display_order = 0 WHERE id = 202; -- M lên đầu
  UPDATE VariationOptions SET display_order = 1 WHERE id = 201; -- S xuống sau
  ```

### 3. "Phép thuật" hiển thị (Data Retrieval)
Khi truy vấn danh sách SKU để hiển thị, hệ thống sẽ sắp xếp dựa trên `DisplayOrder`. SQL tương đương:
```sql
ORDER BY 
    Variation_Group_ID ASC,     -- Gom nhóm Màu trước, Size sau
    Option_DisplayOrder ASC;    -- Sắp xếp: M trước S (vì M.DisplayOrder=0, S.DisplayOrder=1)
```

Điều này giúp SKU tự động hiển thị đúng thứ tự mong muốn:
- `Áo Đỏ - Size M` (lên trước)
- `Áo Đỏ - Size S` (xuống sau)

## Cài đặt & Chạy

1. **Yêu cầu**:
   - .NET 10 SDK (Preview hoặc bản chính thức).
   - SQL Server.

2. **Cấu hình Database**:
   Trong `appsettings.json`, chuỗi kết nối đang trỏ về `Server=.`. Hãy sửa lại nếu cần.

3. **Chạy ứng dụng**:
   ```bash
   dotnet run
   ```
   *Lưu ý: Nếu database cũ (chưa có cột DisplayOrder) tồn tại, hãy xóa database cũ để `DbInitializer` tạo lại từ đầu.*

## Sử dụng API

### Get danh sách SKU (Dạng phẳng)
`GET /api/products/1/skus-flat`

Kết quả JSON sẽ trả về tên biến thể đã được sắp xếp đúng thứ tự (VD: "Màu sắc: Đỏ - Kích thước: M" nếu M được set lên trước).

### Thay đổi thứ tự Option
`POST /api/variations/options/reorder`
Body (JSON):
```json
[
  4, 3
]
```
*(Giả sử 4 là ID của Size M, 3 là ID của Size S. Gọi API này để đảo Size M lên trước S).*
