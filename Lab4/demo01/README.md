# Demo 01: JWT Authentication với .NET 10 & EF Core

## 1. Giới thiệu
Mục tiêu của Demo 01 là xây dựng một hệ thống Web API cơ bản thực hiện xác thực người dùng bằng JSON Web Token (JWT). Hệ thống sử dụng Entity Framework Core (Code First) để quản lý cơ sở dữ liệu và cung cấp một endpoint sinh mã Token bảo mật sau khi kiểm tra thông tin đăng nhập thành công.

## 2. Cấu trúc thư mục quan trọng
- **Models/**: Chứa các thực thể dữ liệu (`UserInfo`, `Product`) và DTO (`LoginRequest`).
- **Data/AppDbContext.cs**: Cấu hình kết nối cơ sở dữ liệu, quản lý các tập thực thể và thực hiện chèn dữ liệu mẫu (Seed Data).
- **Controllers/TokenController.cs**: Xử lý logic đăng nhập, xác thực thông tin người dùng từ database và sinh JWT.
- **appsettings.json**: Lưu trữ chuỗi kết nối database và các thông số cấu hình JWT (Key, Issuer, Audience, Duration).
- **Program.cs**: Đăng ký các dịch vụ (DbContext, Authentication), cấu hình middleware và tích hợp logic tự động apply Migrations.

## 3. Hướng dẫn chạy tự động
Hệ thống đã được thiết lập để tự động khởi tạo cơ sở dữ liệu. Bạn chỉ cần thực hiện các bước sau:
1. Mở terminal tại thư mục `demo01/JwtAuthApi`.
2. Gõ lệnh:
   ```bash
   dotnet run
   ```
3. Hệ thống sẽ tự động:
   - Build project.
   - Kiểm tra và tự động tạo database `CSharp6Lab4Demo01` (nếu chưa có) nhờ EF Core Migrate.
   - Chèn dữ liệu mẫu (User: `Thepv@fpoly.fpt`, Password: `1234`).
   - Lắng nghe yêu cầu tại địa chỉ: `https://localhost:7000` (hoặc cổng ngẫu nhiên được cấp).

## 4. Giải thích Code
- **Thuật toán mã hoá**: Sử dụng thuật toán `HMACSHA256` kết hợp với một `Secret Key` (được lưu trong appsettings.json) để đảm bảo tính toàn vẹn của Token.
- **Payload (Claims)**: JWT bao bao gồm các thông tin quan trọng (Claims) như:
    - `sub`: Định danh người dùng.
    - `jti`: Mã định danh duy nhất cho Token (ngăn chặn replay attack).
    - `iat`: Thời điểm phát hành Token.
    - Các thông tin bổ sung: `FirstName`, `LastName`, `UserName`, `Email`, `Id`.
- **Secret Key**: Đóng vai trò là "chìa khoá" để Server ký và xác minh tính hợp lệ của Token. Nếu Key bị lộ, bất kỳ ai cũng có thể giả mạo Token.

## 5. Kịch bản kiểm thử (Test Scenarios)

Bạn có thể sử dụng tệp `.http` hoặc các công cụ như Postman để kiểm tra:

### Endpoint: POST `/api/token`
**Payload (JSON):**
```json
{
  "Email": "Thepv@fpoly.fpt",
  "Password": "1234"
}
```

**Kết quả mong đợi (Token nhận được):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2026-03-19T14:55:00Z"
}
```

> **Lưu ý:** Hãy copy toàn bộ chuỗi `token` nhận được để chuẩn bị cho việc thực hiện các yêu cầu API cần bảo mật trong **Demo 02**.
