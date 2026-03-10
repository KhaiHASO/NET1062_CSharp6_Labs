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

**🌟 Sau khi chạy xong**: Bấm `<F5>` (Với Visual Studio) hoặc lệnh `dotnet run` (VS Code), trình duyệt sẽ mở thẳng ra trang giao diện Swagger ở Base URL (route `/`). Bạn có thể thử nghiệm các hàm API!
