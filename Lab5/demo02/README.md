# Demo 02 - Input Validation và Sanitization trong ASP.NET Core Minimal API

## 1. Giới thiệu tổng quan

`demo02` là dự án ASP.NET Core Minimal API trên .NET 10 dùng để minh họa hai kỹ thuật bảo mật đầu vào rất quan trọng:

- `Input Validation`: kiểm tra dữ liệu đầu vào bằng `FluentValidation` và `Route Constraints`.
- `Sanitization`: làm sạch nội dung HTML bằng `HtmlSanitizer` để giảm rủi ro XSS.

Dự án cũng dùng `Entity Framework Core` với `SQL Server LocalDB` để lưu dữ liệu, đồng thời cho thấy cách EF Core hỗ trợ hạn chế rủi ro SQL Injection thông qua cơ chế truy vấn tham số hóa.

## 2. Công nghệ sử dụng

- ASP.NET Core Minimal API (.NET 10)
- Entity Framework Core với SQL Server
- FluentValidation
- HtmlSanitizer (`Ganss.Xss`)
- Swagger / Swashbuckle

## 3. Cấu trúc thư mục

```text
demo02/
|-- Data/
|   `-- AppDbContext.cs
|-- Models/
|   |-- Post.cs
|   `-- User.cs
|-- Properties/
|   `-- launchSettings.json
|-- Validators/
|   `-- UserValidator.cs
|-- appsettings.Development.json
|-- appsettings.json
|-- demo02.csproj
|-- Program.cs
|-- README.md
|-- run.ps1
|-- run.sh
`-- promt.txt
```

## 4. Hướng dẫn chạy dự án tự động bằng script

### Chạy trên Windows PowerShell

Mở terminal tại thư mục dự án và chạy:

```powershell
./run.ps1
```

Script sẽ thực hiện lần lượt:

1. `dotnet build`
2. `dotnet ef migrations add InitialDemo02`
3. `dotnet ef database update`
4. `dotnet run`

### Chạy trên macOS/Linux

Phân quyền thực thi trước:

```bash
chmod +x run.sh
```

Sau đó chạy:

```bash
./run.sh
```

## 5. Giải thích ngắn gọn về source code

### FluentValidation

File `Validators/UserValidator.cs` định nghĩa các rule:

- `Username` bắt buộc nhập, độ dài từ `3` đến `20`.
- `Email` bắt buộc nhập và phải đúng định dạng email.
- `Age` phải nằm trong khoảng từ `18` đến `99`.

Trong `Program.cs`, validator được đăng ký bằng:

```csharp
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();
```

Endpoint `POST /users` sẽ gọi:

```csharp
await validator.ValidateAsync(user)
```

Nếu dữ liệu không hợp lệ, API trả về `ValidationProblem`.

### Route Constraints

Endpoint:

```text
GET /persons/{personId:int:min(1)}/age/{age:min(0):max(120)}
```

Ý nghĩa:

- `personId` phải là số nguyên và lớn hơn hoặc bằng `1`.
- `age` phải nằm trong khoảng từ `0` đến `120`.

Nếu URL không đúng ràng buộc, request sẽ không match route hợp lệ.

### HtmlSanitizer

Endpoint `POST /posts` sử dụng:

```csharp
var sanitizer = new HtmlSanitizer();
post.Content = sanitizer.Sanitize(post.Content);
```

Nếu client gửi nội dung có chứa mã nguy hiểm như:

```html
<script>alert(1)</script>
```

thì phần nguy hiểm sẽ bị loại bỏ trước khi lưu xuống database.

## 6. Kịch bản demo cực kỳ chi tiết với Swagger hoặc Postman

Sau khi chạy ứng dụng, mở Swagger tại:

```text
http://localhost:5117/swagger
```

Hoặc dùng Postman với cùng base URL.

### Kịch bản 1: Tạo User hợp lệ

**Request**

- Method: `POST`
- URL: `/users`
- Body:

```json
{
  "username": "nguyenvana",
  "email": "vana@example.com",
  "age": 25
}
```

**Kỳ vọng kết quả**

- HTTP Status: `200 OK`
- Dữ liệu được lưu vào bảng `Users`
- Response trả về object user vừa lưu

### Kịch bản 2: Tạo User sai do username quá ngắn

**Request**

- Method: `POST`
- URL: `/users`
- Body:

```json
{
  "username": "ab",
  "email": "vana@example.com",
  "age": 25
}
```

**Kỳ vọng kết quả**

- HTTP Status: `400 Bad Request`
- Response chứa lỗi validation cho `Username`
- Dữ liệu không được lưu vào database

### Kịch bản 3: Tạo User sai do email không đúng định dạng

**Request**

- Method: `POST`
- URL: `/users`
- Body:

```json
{
  "username": "nguyenvana",
  "email": "vana-at-example.com",
  "age": 25
}
```

**Kỳ vọng kết quả**

- HTTP Status: `400 Bad Request`
- Response chứa lỗi validation cho `Email`
- Dữ liệu không được lưu vào database

### Kịch bản 4: Tạo User sai do tuổi ngoài khoảng cho phép

**Request**

- Method: `POST`
- URL: `/users`
- Body:

```json
{
  "username": "nguyenvana",
  "email": "vana@example.com",
  "age": 16
}
```

**Kỳ vọng kết quả**

- HTTP Status: `400 Bad Request`
- Response chứa lỗi validation cho `Age`
- Dữ liệu không được lưu vào database

### Kịch bản 5: Route Constraints hợp lệ

**Request**

- Method: `GET`
- URL: `/persons/5/age/30`

**Kỳ vọng kết quả**

- HTTP Status: `200 OK`
- Response:

```text
PersonId: 5, Age: 30 is valid
```

### Kịch bản 6: Route Constraints không hợp lệ do `personId` nhỏ hơn 1

**Request**

- Method: `GET`
- URL: `/persons/0/age/30`

**Kỳ vọng kết quả**

- Route không hợp lệ do `personId` vi phạm `min(1)`
- Thông thường nhận `404 Not Found`

### Kịch bản 7: Route Constraints không hợp lệ do `age` vượt giới hạn

**Request**

- Method: `GET`
- URL: `/persons/5/age/150`

**Kỳ vọng kết quả**

- Route không hợp lệ do `age` vi phạm `max(120)`
- Thông thường nhận `404 Not Found`

### Kịch bản 8: Tạo Post bình thường

**Request**

- Method: `POST`
- URL: `/posts`
- Body:

```json
{
  "title": "Bài viết số 1",
  "content": "<p>Nội dung an toàn</p>"
}
```

**Kỳ vọng kết quả**

- HTTP Status: `200 OK`
- Dữ liệu được lưu vào bảng `Posts`
- Nội dung sau khi sanitize vẫn giữ lại các thẻ HTML an toàn

### Kịch bản 9: Tạo Post chứa mã độc XSS

**Request**

- Method: `POST`
- URL: `/posts`
- Body:

```json
{
  "title": "Bài viết độc hại",
  "content": "<script>alert(1)</script><p>Xin chào</p>"
}
```

**Kỳ vọng kết quả**

- HTTP Status: `200 OK`
- Phần `<script>alert(1)</script>` bị loại bỏ
- Response có thể còn lại:

```json
{
  "id": 0,
  "title": "Bài viết độc hại",
  "content": "<p>Xin chào</p>"
}
```

- Database chỉ lưu nội dung đã được làm sạch

### Kịch bản 10: Minh họa dữ liệu kiểu tấn công SQL Injection

**Request**

- Method: `POST`
- URL: `/posts`
- Body:

```json
{
  "title": "SQL Injection Test",
  "content": "'; DROP TABLE Posts; --"
}
```

**Kỳ vọng kết quả**

- HTTP Status: `200 OK`
- Dữ liệu được lưu như một chuỗi văn bản bình thường
- EF Core sử dụng truy vấn tham số hóa nên không thực thi chuỗi này như lệnh SQL

## 7. Kết luận

Demo 02 cho thấy một API an toàn không chỉ cần kiểm tra dữ liệu hợp lệ, mà còn cần làm sạch dữ liệu trước khi lưu hoặc hiển thị lại. Kết hợp `FluentValidation`, `Route Constraints` và `HtmlSanitizer` là cách đơn giản nhưng hiệu quả để tăng cường bảo mật cho ASP.NET Core Minimal API.
