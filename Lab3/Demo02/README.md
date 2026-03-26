# Demo 02: Tích hợp Serilog và Global Error Handling

Dự án này minh họa cách tích hợp thư viện **Serilog** để ghi nhật ký (logging) và triển khai cơ chế **Global Error Handling** (Xử lý lỗi toàn cục) bằng `IExceptionHandler` trong ASP.NET Core Minimal API (.NET 10).

## 1. Mục đích dự án
- **Serilog:** Thay thế provider logging mặc định để ghi log chuyên nghiệp ra Console và File với tính năng tự động xoay vòng (rolling file).
- **Global Error Handling:** Sử dụng `IExceptionHandler` để bắt tất cả các ngoại lệ chưa được xử lý, ghi log lỗi và trả về phản hồi theo chuẩn `ProblemDetails` cho client thay vì để lộ toàn bộ stack trace.

## 2. Cấu trúc thư mục quan trọng
- `Program.cs`: Nơi cấu hình Serilog, đăng ký middleware và định nghĩa các API endpoints.
- `GlobalExceptionHandler.cs`: Class triển khai interface `IExceptionHandler` để xử lý các lỗi phát sinh trong hệ thống.
- `Logs/`: Thư mục chứa các file log được tạo ra hằng ngày (ví dụ: `log-20260317.txt`).

## 3. Hướng dẫn chạy dự án
1. Mở terminal tại thư mục `Demo02`.
2. Chạy lệnh:
   ```bash
   dotnet restore
   dotnet run
   ```
3. Sau khi ứng dụng chạy, bạn có thể kiểm tra file log tại thư mục `Logs/`.

## 4. Giải thích Code chi tiết

### Cấu hình Serilog
Serilog được cấu hình trong `Program.cs` để ghi log song song ra Console và File. `rollingInterval: RollingInterval.Day` đảm bảo mỗi ngày sẽ có một file log mới được tạo ra, giúp quản lý log dễ dàng hơn.
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

### IExceptionHandler & ProblemDetails
`GlobalExceptionHandler` chặn mọi exception không được `try-catch`. Nó ghi lại thông tin lỗi chi tiết vào Serilog và sử dụng `ProblemDetails` để format phản hồi JSON chuẩn RFC 7807 trả về cho người dùng:
```csharp
var problemDetails = new ProblemDetails
{
    Status = StatusCodes.Status500InternalServerError,
    Title = "Lỗi hệ thống",
    Detail = "Đã có lỗi xảy ra phía máy chủ...",
    Instance = httpContext.Request.Path
};
```

## 5. Kịch bản kiểm thử (Test Scenarios)

### Kịch bản 1: Ghi nhật ký (Logging)
- **Hành động:** Truy cập `GET http://localhost:5000/api/test-log`.
- **Kết quả:** Trình duyệt/Postman nhận được JSON thông báo thành công. Mở thư mục `Logs/` để thấy các dòng log `Information`, `Warning`, và `Error` đã được ghi lại.

### Kịch bản 2: Xử lý lỗi (Error Handling)
- **Hành động:** Truy cập `GET http://localhost:5000/api/test-error`.
- **Kết quả:** Client nhận được response JSON chuẩn (Mã 500) như sau:
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "title": "Lỗi hệ thống",
  "status": 500,
  "detail": "Đã có lỗi xảy ra phía máy chủ. Vui lòng kiểm tra log để biết thêm chi tiết.",
  "instance": "/api/test-error"
}
```
Thông tin chi tiết về lỗi và Stack Trace thực tế sẽ được ghi kín đáo vào file log thay vì trả về cho người dùng.
