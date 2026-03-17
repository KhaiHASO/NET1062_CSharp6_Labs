# Demo 01: Minimal API với Entity Framework Core (.NET 10)

## 1. Giới thiệu
Ứng dụng "Demo 01" minh họa cách tích hợp **Minimal API** và **Entity Framework Core (Code First)** trong .NET 10 để quản lý thông tin sinh viên. Dự án sử dụng cấu hình trực tiếp trong `Program.cs` mà không thông qua Controller, giúp mã nguồn gọn nhẹ và dễ hiểu.

## 2. Cấu trúc thư mục
- `Demo01/`: Thư mục project chính.
  - `Data/AppDbContext.cs`: Quản lý kết nối và các thực thể (Entity) trong cơ sở dữ liệu.
  - `Models/SinhVien.cs`: Định nghĩa thực thể `SinhVien`.
  - `Program.cs`: Cấu hình dịch vụ (Services), Middleware, và định nghĩa các API Endpoints.
  - `appsettings.json`: Lưu trữ chuỗi kết nối (Connection String) và các cấu hình khác.
- `README.md`: Hướng dẫn chi tiết về dự án.

## 3. Hướng dẫn chạy dự án

### Bước 1: Khôi phục dependencies
```bash
dotnet restore
```

### Bước 2: Chạy lệnh Migration (Nếu chưa có DB)
Dự án đã được cấu hình sẵn, nhưng nếu bạn muốn tạo lại DB:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Bước 3: Chạy ứng dụng
```bash
dotnet run
```
Sau khi chạy, bạn có thể truy cập Swagger UI tại: `https://localhost:<port>/swagger` (cổng <port> sẽ hiển thị trên terminal).

## 4. Giải thích Code chi tiết

### AppDbContext
Kế thừa từ `DbContext`, là cầu nối giữa code C# và Database SQL Server.
- `DbSet<SinhVien>`: Đại diện cho bảng `SinhViens`.
- `OnModelCreating`: Sử dụng Fluent API để ràng buộc các thuộc tính như `MaxLength` và `Required`.

### Đăng ký Service trong Program.cs
- `builder.Services.AddDbContext`: Đăng ký context vào hệ thống Dependency Injection.
- `builder.Services.AddEndpointsApiExplorer` & `AddSwaggerGen`: Cấu hình để hiển thị tài liệu API thông qua Swagger.

### Các Endpoints (Minimal API)
- `MapGet("/")`: Lấy toàn bộ danh sách sinh viên.
- `MapGet("/{id}")`: Tìm sinh viên theo khóa chính (Guid).
- `MapPost("/")`: Thêm mới sinh viên, tự động trả về mã `201 Created`.
- `MapPut("/{id}")`: Cập nhật thông tin sinh viên hiện có.
- `MapDelete("/{id}")`: Xóa sinh viên khỏi hệ thống.

## 5. Kịch bản kiểm thử (Test Scenarios)

### Thêm sinh viên mới (POST)
- **URL:** `https://localhost:<port>/api/sinhviens`
- **Payload mẫu:**
```json
{
  "mssv": "PH12345",
  "hoTen": "Nguyen Van A",
  "diemTrungBinh": 8.5,
  "chuyenNganh": "Phat Trien Phan Mem"
}
```

### Lấy danh sách (GET)
- **URL:** `https://localhost:<port>/api/sinhviens`

### Cập nhật (PUT)
- **URL:** `https://localhost:<port>/api/sinhviens/{id}`
- **Payload mẫu:**
```json
{
  "mssv": "PH12345",
  "hoTen": "Nguyen Van A (Updated)",
  "diemTrungBinh": 9.0,
  "chuyenNganh": "Cong Nghe Thong Tin"
}
```

### Xóa (DELETE)
- **URL:** `https://localhost:<port>/api/sinhviens/{id}`
