# Hướng dẫn Demo 01 - Tổng quan Minimal APIs & Kết nối LocalDB

## Mục tiêu
Tài liệu này hướng dẫn bạn cách tạo và cấu hình một dự án ASP.NET Core Minimal API toàn diện, kết nối với cơ sở dữ liệu SQL Server LocalDB qua Entity Framework Core (Code-First) và kiểm thử API bằng Swagger.

---

## Bước 1: Khởi tạo dự án
Các bước để tạo dự án mới trong Visual Studio:
1. Chọn template **ASP.NET Core Web API**.
2. Đặt tên dự án là `Demo01` và chọn framework **.NET 10.0**.
3. **Lưu ý quan trọng:** Hãy bỏ chọn ô **"Use controllers"** (để sử dụng Minimal API thay vì kiến trúc Controller truyền thống).
4. Đảm bảo đã chọn **"Enable OpenAPI support"** để ứng dụng tích hợp sẵn công cụ hỗ trợ test API (Swagger).

*(Hoặc khởi tạo bằng dòng lệnh: `dotnet new webapi -n Demo01 -f net10.0 -controllers false`)*

---

## Bước 2: Tìm hiểu cấu trúc file Program.cs
Khi mở file `Program.cs`, bạn sẽ thấy cấu trúc mã nguồn của Minimal API rất nhỏ gọn:
- **Sự khác biệt với Controller:** Không cần khởi tạo class hay kế thừa `ControllerBase`. Toàn bộ cấu hình và routing nằm gọn trong một file duy nhất.
- **Cú pháp ngắn gọn:** Sử dụng cú pháp lambda `() =>` để định nghĩa các endpoint và kết quả trả về.
- **Dependency Injection (Tiêm phụ thuộc):** Các thành phần như DbContext được tiêm trực tiếp vào tham số (parameter) của hàm, ví dụ: `(AppDbContext db) =>`.
- **Đăng ký Service và Middleware:** Các thiết lập cơ bản như cấu hình Entity Framework Core và Swagger (`app.UseSwagger()`, `app.UseSwaggerUI()`) được thực hiện vô cùng trực quan và liền mạch.

---

## Bước 3: Chạy Migrations
Hiện tại dự án đã định nghĩa Model (`Book.cs`) và DbContext (`AppDbContext.cs`), nhưng cơ sở dữ liệu dưới LocalDB vẫn chưa được tạo.
Để tạo Database thực tế và áp dụng Seed data (dữ liệu mẫu), hãy tiến hành mở terminal tại thư mục chứa dự án (ví dụ `Demo01`) và chạy 2 lệnh sau:

```cmd
dotnet ef migrations add InitialCreate
dotnet ef database update
```

*(Nếu bạn dùng Visual Studio Package Manager Console, lệnh sẽ là `Add-Migration InitialCreate` và `Update-Database`)*

---

## Bước 4: Chạy ứng dụng và trải nghiệm Swagger UI
Sau khi Database được khởi tạo thành công, tiến hành chạy ứng dụng (nhấn nút Run hoặc dùng lệnh `dotnet run`).
1. Trình duyệt sẽ mở ra hoặc bạn truy cập thủ công vào đường dẫn: `https://localhost:<port>/swagger` (port sẽ thay đổi tùy máy).
2. Thao tác thử các API:
   - Click vào từng endpoint (GET, POST...).
   - Nhấn nút **"Try it out"**.
   - Nhập thông số (ví dụ: ID cuốn sách) hoặc body dữ liệu (dạng JSON) rồi nhấn **"Execute"**.
3. Xem phản hồi (Response):
   - Chú ý đến Status Code trả về (như là **200 OK** khi thành công bình thường, hay **201 Created** khi thêm thành công sách mới).
   - Bạn cũng có thể xem lệnh **Curl** tương ứng bên dưới để biết cách gọi API thủ công.

---

## 📌 Các phương thức HTTP (HTTP Methods) cơ bản
Khi làm việc với các RESTful và Minimal APIs, hãy ghi nhớ ý nghĩa của các phương thức này:
- **`GET`**: Dùng để ĐỌC hoặc LẤY dữ liệu.
- **`POST`**: Dùng để TẠO MỚI một tài nguyên dữ liệu.
- **`PUT`**: Dùng để SỬA/CẬP NHẬT TOÀN BỘ thông tin của một tài nguyên hiện có.
- **`DELETE`**: Dùng để XÓA dữ liệu.
