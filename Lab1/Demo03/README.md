# 📖 Kịch bản Demo 03 - Tích hợp Swagger & EF Core Code-First (ASP.NET Core Web API)

Dự án này là một RESTful API hoàn chỉnh bằng C# (.NET 10), sử dụng **Entity Framework Core Code-First** kết nối tới **SQL Server LocalDB** và tự động hóa tài liệu API bằng **Swagger**.

## 1. Thông tin Dự án
- **Minimal Hosting Model** (.NET 10).
- Kết nối CSDL thông qua mảng cấu hình `appsettings.json`.
- Entity `Employee` với Data Annotations (`[Required]`, `[EmailAddress]`).
- Tự động sinh dữ liệu mẫu cho 2 bản ghi (Seed Data qua `OnModelCreating`).
- Cấu hình Swagger bằng cách đọc file XML nội bộ (`GenerateDocumentationFile`) để hiển thị đầy đủ tài liệu, ví dụ request và status code.

## 2. Cấu trúc Thư mục

- **`Models/Employee.cs`**: Định nghĩa bảng Employee (`Id`, `FirstName`, `LastName`, `EmailId`).
- **`Data/AppDbContext.cs`**: Context thao tác DB, chứa `DbSet<Employee>` và tạo sẵn 2 nhân viên mẫu.
- **`Controllers/EmployeeController.cs`**: API endpoint thao tác `GET` (Lấy dữ liệu) và `POST` (Tạo mới). Được bổ sung nhiều XML Comments (`<summary>`, `<remarks>`).
- **`appsettings.json`**: Cấu hình Data Connection (`DefaultConnection`) vào LocalDB của SQL Server (`EmployeeSwaggerDB`).
- **`Program.cs`**: Đăng ký DbContext, tiêm Swagger UI để sinh giao diện OpenAPI chứa thông tin tác giả hệ thống.
- **`Demo03.csproj`**: Kích hoạt việc tự động viết tài liệu XML Comment qua tag `<GenerateDocumentationFile>true</GenerateDocumentationFile>`.

## 3. Hướng dẫn chạy & Cài đặt Migration

Để chạy dự án và khởi tạo CSDL thông qua Code-First, bạn cần thực hiện các lệnh Migration.

### Nếu bạn sử dụng Package Manager Console (Trong Visual Studio):
1. Mở **Tools** -> **NuGet Package Manager** -> **Package Manager Console**.
2. Chạy lệnh tạo bản nháp Migration:
   ```powershell
   Add-Migration InitialCreate
   ```
3. Chạy lệnh cập nhật (tạo) Database:
   ```powershell
   Update-Database
   ```

### Nếu bạn sử dụng .NET CLI (Trong Terminal/VS Code):
1. (Tùy chọn) Cài đặt công cụ EF Core toàn cầu nếu máy bạn chưa được thiết lập:
   ```bash
   dotnet tool install --global dotnet-ef
   ```
2. Chạy lệnh sinh file Migration:
   ```bash
   dotnet ef migrations add InitialCreate
   ```
3. Chạy lệnh cập nhật (tạo) Database thực tế vào LocalDB:
   ```bash
   dotnet ef database update
   ```

## 4. Hướng dẫn chạy và Test API (Bắt buộc)

Sau khi Database đã được tạo thành công, tiến hành chạy ứng dụng:

### Cách 1: Chạy bằng Visual Studio (Khuyên dùng)
1. Chọn Profile là `http` hoặc `https` (Cạnh nút nút Play màu xanh lá phía trên cùng).
2. Bấm phím **`F5`** (hoặc nút Play xanh).
3. Trình duyệt sẽ tự động bật lên giao diện Swagger tại địa chỉ `http://localhost:5000/`.

### Cách 2: Chạy bằng Terminal / VS Code
1. Mở Terminal tại thư mục `Demo03`.
2. Gõ lệnh sau để khởi động web server:
   ```bash
   dotnet run
   ```
3. Mở trình duyệt và truy cập vào đường dẫn: [http://localhost:5000/](http://localhost:5000/)

---

**🌟 Trải nghiệm API trên Swagger:**
- Cuộn xuống phần `EmployeeController`, bạn sẽ thấy 2 API là `GET` và `POST`.
- Bấm vào `GET /api/Employee` -> `Try it out` -> `Execute` để xem danh sách 2 nhân viên đã được tạo sẵn trong cơ sở dữ liệu.
- Bạn có thể thử nghiệm tạo nhân viên mới qua API `POST`, kiểm tra validation (nếu thiếu `emailId` thì hệ thống sẽ trả về lỗi `400 BadRequest` vì chúng ta đã dùng `[Required]`).
