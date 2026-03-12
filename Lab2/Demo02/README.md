# Kịch bản Demo 02 - Sức mạnh của DI khi yêu cầu nghiệp vụ thay đổi

## 1. Giới thiệu mục tiêu demo
Chào mừng bạn đến với dự án Demo 02! Dự án này được thiết kế để học viên hiểu sâu sắc về thiết kế **Dependency Injection (DI)** thông qua một bài toán thực tế của doanh nghiệp.

**Tại sao DI lại quan trọng?**  
Trong thực tế đi làm, yêu cầu của khách hàng liên tục thay đổi theo thời gian. Một hệ thống tốt là hệ thống dễ dàng thích nghi với sự thay đổi đó mà không đòi hỏi phải chỉnh sửa đi chỉnh sửa lại các file code đã chạy ổn định. Bằng việc "tiêm phụ thuộc" (Dependency Injection) thông qua Interfaces, các lớp (classes) trong ứng dụng sẽ không bị ràng buộc chặt chẽ với nhau (loose coupling), giúp mã nguồn sạch, dễ maintain và dễ nâng cấp.

---

## 2. Giải thích chi tiết cấu trúc source code
Source code được phân chia theo thư mục một cách có hệ thống, mô phỏng đúng kiến trúc Layer của dự án thật:

- **`Models/Book.cs`**:
  Lớp thực thể đại diện cho cấu trúc dữ liệu của cuốn sách trong database. Gồm các thuộc tính như `Id`, `Title`, `Author`.

- **`Data/AppDbContext.cs`**:
  Lớp kết nối cơ sở dữ liệu (DbContext của Entity Framework Core). Đóng vai trò cấu hình để EF Core ánh xạ `Book` thành bảng `Books` trong SQL Server.

- **`Repositories/IBookRepository.cs`** & **`Repositories/SqlBookRepository.cs`**:
  Lớp **Repository** chịu trách nhiệm thao tác trực tiếp với Database (Thêm sách, Lấy sách). `IBookRepository` định nghĩa interface chuẩn, còn `SqlBookRepository` chứa logic thao tác qua `AppDbContext`. 

- **`Services/INotificationService.cs`** & **`EmailNotificationService.cs`** & **`TelegramNotificationService.cs`**:
  Đây là **linh hồn của bài demo**. Chúng ta có 1 bản thiết kế chức năng thông báo (`INotificationService`) nhưng có tới 2 cách thực thi khác nhau (`Email` và `Telegram`). Nó được tạo ra để thử nghiệm kịch bản khi sếp yêu cầu đổi phương thức thông báo.

- **`Services/IBookService.cs`** & **`Services/BookService.cs`**:
  Lớp **Service** chứa logic nghiệp vụ cốt lõi. Trong `BookService`, khi hàm `AddBookAsync` được gọi, nó sẽ nhờ `Repository` để lưu sách, rồi tiếp tục nhờ `NotificationService` để gửi thông báo. Tham số được truyền vào qua Constructor – Đây gọi là **Constructor Injection**.
  
- **`appsettings.json`**:
  Nơi chứa cấu hình chuỗi kết nối (`DefaultConnection`) tới LocalDB của SQL Server.

- **`Program.cs`**:
  Là file khởi chạy ứng dụng. Mọi "phép thuật" của DI diễn ra ở đây, khi chúng ta tiến hành đăng ký những công cụ kể trên vào hệ thống (`AddScoped<...>`).

---

## 3. Hướng dẫn cài đặt và chạy dự án

Hãy làm theo các bước sau nếu bạn bắt đầu dựng dự án lại từ đầu:

**Bước 1: Khởi tạo Project (Minimal API)**
```cmd
dotnet new webapi -n Demo02 -f net10.0 -controllers false
```

**Bước 2: Cài đặt các Package của Entity Framework Core & Swagger**
Mở terminal trong thư mục `Demo02` và chạy:
```cmd
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Swashbuckle.AspNetCore
```

**Bước 3: Chuẩn bị Cấu hình và Code**
Copy mã nguồn của các thư mục `Models`, `Data`, `Repositories`, `Services`, setup file `appsettings.json` và `Program.cs`. 

**Bước 4: Chạy Migration để khởi tạo Database**
Chạy 2 lệnh sau để sinh ra database SQL Server LocalDB:
```cmd
dotnet ef migrations add InitialCreate
dotnet ef database update
```
*(Database `CSharp6-lab2-demo02-DI` sẽ được tạo ra tại `(localdb)\mssqllocaldb`)*

**Bước 5: Chạy dự án**
```cmd
dotnet run
```
Truy cập: `https://localhost:<port>/swagger` để test các API.

---

## 4. Kịch bản demo 🎭

### Bước 1: Chạy hệ thống với EmailNotificationService
1.  mở file `Program.cs` và chỉ dòng code đăng ký hiện tại:
   `builder.Services.AddScoped<INotificationService, EmailNotificationService>();`
2. Tiến hành chạy ứng dụng và bật Swagger.
3. Chọn API `POST /books`, nhập Body (chuỗi JSON sách) rồi nhấn **Execute**.
4. Mở cửa sổ Console (Terminal) của ứng dụng để người học quan sát. Màn hình sẽ log ra câu:
   > 📩 **"Gửi Email tới Admin: Đã thêm sách mới: [Tên Sách]"**
   *(Kèm theo dữ liệu đã thực sự được lưu vào LocalDB)*

### Bước 2: Tình huống thay đổi yêu cầu từ sếp
"Sếp vừa gửi email bảo là gửi thông báo qua Email hiện nay chậm quá và trôi mất tin nhắn. Đội marketing yêu cầu chúng ta phải chuyển sang bắn tin nhắn về nhóm Telegram của công ty."

Lúc này,  tiến hành phân tích:
- Nếu viết code theo kiểu "dính chặt" (tight coupling) – khởi tạo `new EmailNotificationService()` trực tiếp bên trong logic của `BookService`, chúng ta sẽ phải mở `BookService` ra để xoá code cũ và viết code mới.
- Điều này có thể gây hỏng hóc các phần logic khác đang chạy ổn định của `BookService` (vi phạm nguyên lý Open-Closed).

### Bước 3: Phép thuật của DI giải quyết bài toán
1.  mở file `Program.cs` quay trở lại chỗ đăng ký DI ban nãy.
2. Tiến hành comment dòng Email và mở comment dòng Telegram lên:
   ```csharp
   // builder.Services.AddScoped<INotificationService, EmailNotificationService>(); // Bỏ đi
   builder.Services.AddScoped<INotificationService, TelegramNotificationService>(); // Yêu cầu thay đổi
   ```
3. Chạy lại dự án. Reload Swagger.
4. Chọn `POST /books` để thêm một cuốn sách khác.
5. Cho lớp thấy cửa sổ Console giờ đây đã log ra câu:
   > 🚀 **"Bắn tin nhắn Telegram tới Group: Đã thêm sách mới: [Tên Sách]"**
6. **Bùng nổ!** Thông qua DI, chúng ta đã thay đổi hoàn toàn cách hệ thống gửi thông báo mà **không hề phải đụng vào dù chỉ là một dấu phẩy bên trong `BookService`!**

---

## 5. Tổng kết kiến thức: 4 lợi ích cốt lõi của Dependency Injection
Qua ví dụ trên, chúng ta rút ra được 4 sức mạnh to lớn của DI:
1. **Tách biệt logic (Decoupling):** Các class phụ thuộc vào Abstract (Interface) chứ không phụ thuộc trực tiếp vào Implementation.
2. **Dễ mở rộng và đáp ứng khi yêu cầu thay đổi:** Giống như rút phích cắm điện từ ổ này sang ổ khác. Khi cần dùng công cụ mới, chỉ việc đổi dòng đăng ký ở bộ chứa `Program.cs`.
3. **Quản lý phụ thuộc tập trung:** `Program.cs` trở thành một cái bảng điện điều khiển toàn bộ cấu trúc kiến trúc ứng dụng.
4. **Tái sử dụng & Kiểm thử dễ dàng (Mocking):** Ta có thể dễ dàng viết Unit Test cho `BookService` thông qua việc truyền Mock Service ảo vào constructor mà không cần gửi email thật.

**Kết luận:** Dependency Injection là một trong những cơ chế thần thánh nhất trong ASP.NET Core giúp lập trình viên đáp ứng được sự "sớm nắng chiều mưa" trong thay đổi của khách hàng một cách thanh lịch và nhẹ nhàng nhất! 🚀
