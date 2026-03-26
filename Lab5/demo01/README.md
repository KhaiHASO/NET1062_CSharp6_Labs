# Demo 01 - Rate Limiting với ASP.NET Core Minimal API

Project này là bài demo cho Lab 5, minh hoạ cách bảo vệ API bằng Rate Limiting trong ASP.NET Core Minimal API. Ứng dụng kết hợp 3 nhóm chức năng chính:

- giới hạn tần suất gọi API để tránh spam, abuse và DoS cơ bản
- fake authentication để mô phỏng người dùng đã đăng nhập
- Entity Framework Core + SQL Server LocalDB để chứng minh API vẫn truy cập dữ liệu bình thường

Toàn bộ project được viết theo hướng tối giản để dễ demo trên lớp, dễ đọc source, dễ test bằng Swagger hoặc `curl`.

## 1. Mục tiêu của demo

Demo này được tạo để trả lời 4 câu hỏi chính:

1. Làm sao cấu hình Rate Limiting trong ASP.NET Core Minimal API?
2. Fixed Window và Sliding Window khác nhau như thế nào?
3. Có thể tách rate limit cho người dùng anonymous và authenticated hay không?
4. Rate limit có ảnh hưởng gì đến các endpoint truy cập database?

Sau khi chạy demo, bạn có thể trình bày được:

- middleware `UseRateLimiter()` chặn request vượt ngưỡng
- endpoint nào bị gắn policy nào
- khi bị chặn, API trả về `429 Too Many Requests`
- fake auth hoạt động bằng header `X-Demo-Auth: true`
- EF Core vẫn thêm và đọc dữ liệu bằng bảng `Users`

## 2. Công nghệ sử dụng

- .NET 10
- ASP.NET Core Minimal API
- `Microsoft.AspNetCore.RateLimiting`
- Entity Framework Core với SQL Server
- SQL Server LocalDB
- Swagger / OpenAPI

## 3. Cấu trúc thư mục

```text
demo01/
|-- Data/
|   `-- AppDbContext.cs
|-- Migrations/
|   |-- 20260326022322_InitialCreate.cs
|   |-- 20260326022322_InitialCreate.Designer.cs
|   `-- AppDbContextModelSnapshot.cs
|-- Models/
|   `-- User.cs
|-- Properties/
|   `-- launchSettings.json
|-- appsettings.json
|-- appsettings.Development.json
|-- Demo01.RateLimiting.csproj
|-- Program.cs
|-- promt.txt
|-- README.md
|-- run.ps1
`-- run.sh
```

## 4. Yêu cầu môi trường

Cần có các thành phần sau:

- .NET SDK 10
- SQL Server LocalDB
- công cụ `dotnet ef`
- quyền tạo database trên LocalDB

Chuỗi kết nối đang dùng trong `appsettings.json`:

```json
"Server=(localdb)\\mssqllocaldb;Database=CSharp6Lab5Demo01;Trusted_Connection=True;MultipleActiveResultSets=true"
```

Tên database bắt buộc là `CSharp6Lab5Demo01`.

## 5. Các package NuGet trong project

Project đang tham chiếu:

- `Microsoft.AspNetCore.OpenApi`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Tools`
- `Microsoft.EntityFrameworkCore.Design`
- `Swashbuckle.AspNetCore`

Ý nghĩa:

- OpenAPI + Swagger để sinh giao diện test API
- EF Core để mapping entity và tạo migration
- SQL Server provider để kết nối LocalDB

## 6. Giải thích tổng quan luồng chạy của ứng dụng

Thứ tự xử lý chính trong `Program.cs`:

1. Tạo `builder`
2. Đăng ký Swagger / OpenAPI
3. Đăng ký `AppDbContext`
4. Đăng ký fake authentication scheme `FakeJwt`
5. Đăng ký authorization
6. Đăng ký các policy rate limiting
7. Build app
8. Bật middleware theo thứ tự:
   - `UseHttpsRedirection()`
   - `UseAuthentication()`
   - `UseAuthorization()`
   - `UseRateLimiter()`
9. Map các endpoint Minimal API

Khi có request đi vào:

- nếu endpoint yêu cầu auth, fake auth sẽ đọc header `X-Demo-Auth`
- nếu endpoint có rate limit, middleware sẽ kiểm tra quota
- nếu vượt ngưỡng, request bị chặn và trả về `429`
- nếu hợp lệ, endpoint mới được thực thi

## 7. Giải thích source code theo từng file

### 7.1. `Program.cs`

Đây là file trung tâm của demo.

Nó chịu trách nhiệm:

- đăng ký service
- cấu hình database
- cấu hình authentication/authorization
- cấu hình rate limiting
- khai báo endpoint

#### a. Cấu hình Swagger

```csharp
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
```

Mục đích:

- sinh OpenAPI document
- hiển thị giao diện Swagger UI
- giúp test nhanh các endpoint khi demo

#### b. Cấu hình Entity Framework Core

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

Mục đích:

- kết nối SQL Server LocalDB
- inject `AppDbContext` vào endpoint
- thao tác bảng `Users`

#### c. Fake authentication

Project không dùng JWT thật. Thay vào đó, project tạo một authentication handler giả lập:

```csharp
builder.Services
    .AddAuthentication("FakeJwt")
    .AddScheme<AuthenticationSchemeOptions, FakeJwtAuthenticationHandler>("FakeJwt", _ => { });
```

Ý nghĩa:

- scheme mặc định tên `FakeJwt`
- nếu request có header `X-Demo-Auth: true`, handler sẽ xem như đã đăng nhập
- người dùng giả lập sẽ có tên `DemoUser`

Vì sao dùng cách này:

- để demo nhanh trên lớp
- không cần tạo token JWT thật
- vẫn minh hoạ được endpoint cần đăng nhập

#### d. Authorization

```csharp
builder.Services.AddAuthorization();
```

Mục đích:

- cho phép dùng `.RequireAuthorization()` trên endpoint `/authenticated`

#### e. Cấu hình global rejection khi vượt limit

```csharp
options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
options.OnRejected = async (context, cancellationToken) =>
{
    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
    context.HttpContext.Response.ContentType = "text/plain; charset=utf-8";
    await context.HttpContext.Response.WriteAsync(
        "Too many requests. Please try again later.",
        cancellationToken);
};
```

Ý nghĩa:

- mọi policy đều dùng chung cách phản hồi khi bị chặn
- mã lỗi là `429 Too Many Requests`
- nội dung phản hồi để người test nhìn thấy ngay nguyên nhân

#### f. Policy `fixed`

```csharp
options.AddFixedWindowLimiter("fixed", limiterOptions =>
{
    limiterOptions.PermitLimit = 5;
    limiterOptions.Window = TimeSpan.FromSeconds(10);
    limiterOptions.QueueLimit = 2;
    limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
});
```

Ý nghĩa:

- mỗi cửa sổ 10 giây chỉ cho tối đa 5 request được xử lý ngay
- thêm tối đa 2 request được xếp hàng đợi
- request vào trước được xử lý trước

Phù hợp để demo:

- dễ nhìn thấy giới hạn rất nhanh
- dễ giải thích thêm khả năng queue trong fixed window

#### g. Policy `SlidingPolicy`

```csharp
options.AddSlidingWindowLimiter("SlidingPolicy", limiterOptions =>
{
    limiterOptions.PermitLimit = 30;
    limiterOptions.Window = TimeSpan.FromSeconds(30);
    limiterOptions.SegmentsPerWindow = 3;
    limiterOptions.QueueLimit = 0;
});
```

Ý nghĩa:

- cửa sổ 30 giây được chia thành 3 đoạn
- hệ thống không reset cùng một lúc như fixed window
- giúp luồng request mềm hơn, ít bị "reset cục"

Điểm cần nói khi demo:

- fixed window dễ hiểu hơn
- sliding window công bằng hơn trong nhiều tình huống thực tế

#### h. Policy `anonymous`

Policy này được tạo bằng `AddPolicy(...)` để có thể chia theo từng nhóm người dùng.

Logic:

- nếu chưa đăng nhập, partition key dựa trên IP hoặc host
- nếu đã đăng nhập mà vẫn gọi endpoint này, key sẽ tách riêng theo tên người dùng
- mỗi partition có quota riêng

Cấu hình:

- `3 request / 10 giây`
- không có queue

#### i. Policy `authenticated`

Policy này cũng là fixed window nhưng mức cao hơn:

- `10 request / 10 giây`
- không có queue

Ý nghĩa demo:

- anonymous bị giới hạn chặt hơn
- authenticated được ưu tiên hơn

#### j. Middleware pipeline

```csharp
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
```

Cần nhớ:

- auth chạy trước để `HttpContext.User` sẵn sàng cho policy cần đọc thông tin người dùng
- rate limiter chạy sau auth/authorization trong project này để phân biệt người dùng anonymous và authenticated

#### k. Các endpoint

`GET /`

- endpoint chào mừng
- trả về thông điệp tổng quan và đường dẫn `/swagger`

`GET /rate-limited`

- gắn policy `fixed`
- dùng để demo fixed window nhanh nhất

`GET /sliding-endpoint`

- gắn policy `SlidingPolicy`
- dùng để demo sliding window

`GET /anonymous`

- gắn policy `anonymous`
- không bắt buộc đăng nhập

`GET /authenticated`

- vừa `RequireAuthorization()`
- vừa `RequireRateLimiting("authenticated")`
- chỉ truy cập được khi gửi header `X-Demo-Auth: true`

`GET /users`

- đọc danh sách người dùng từ database
- có `AsNoTracking()` để đọc nhanh, không cần tracking
- sắp xếp theo `Id`
- gắn policy `fixed`

`POST /users`

- nhận body JSON theo model `CreateUserRequest`
- trim chuỗi `Name`
- lưu vào database
- trả về `201 Created`
- gắn policy `fixed`

#### l. `GetClientIdentifier(HttpContext)`

Hàm này dùng để tạo key cho rate limiting khi người dùng chưa đăng nhập.

Thứ tự ưu tiên:

1. `RemoteIpAddress`
2. `Host` header
3. chuỗi `"unknown"`

Mục đích:

- tránh để tất cả request anonymous dùng chung một quota

#### m. `FakeJwtAuthenticationHandler`

Handler này là phần quan trọng để demo auth mà không cần JWT thật.

Nếu request có:

```http
X-Demo-Auth: true
```

thì handler tạo:

- `ClaimTypes.NameIdentifier = demo-user`
- `ClaimTypes.Name = DemoUser`

Sau đó endpoint `/authenticated` đọc `user.Identity?.Name` và trả về lời chào.

### 7.2. `Data/AppDbContext.cs`

File này định nghĩa `DbContext`.

```csharp
public DbSet<User> Users => Set<User>();
```

Ý nghĩa:

- ánh xạ entity `User` với bảng `Users`

Trong `OnModelCreating`:

- đặt tên bảng là `Users`
- khoá chính là `Id`
- `Name` bắt buộc phải có
- `Name` giới hạn độ dài tối đa 100 ký tự

Đây là nơi minh hoạ Fluent API của EF Core.

### 7.3. `Models/User.cs`

Entity `User` rất đơn giản:

- `Id`: khoá chính, tự tăng
- `Name`: tên người dùng

Mục đích của model này là giữ source code gọn, tập trung vào rate limiting thay vì CRUD phức tạp.

### 7.4. `Migrations/20260326022322_InitialCreate.cs`

Migration đầu tiên tạo bảng `Users` với:

- `Id int identity`
- `Name nvarchar(100) not null`

Ý nghĩa:

- chứng minh EF Core đã được cấu hình đúng
- có thể `database update` để tạo bảng thật trong LocalDB

### 7.5. `appsettings.json`

Nơi lưu:

- chuỗi kết nối database
- logging mặc định

Đây là file cấu hình quan trọng nhất về môi trường kết nối SQL Server.

### 7.6. `appsettings.Development.json`

Tăng mức log khi chạy trong môi trường Development, giúp quan sát request rõ hơn khi demo.

### 7.7. `run.ps1` và `run.sh`

Hai script này tự động hoá quá trình chạy demo.

Thứ tự thực hiện:

1. `dotnet build`
2. kiểm tra migration `InitialCreate` đã tồn tại chưa
3. nếu chưa có thì tạo migration
4. `dotnet ef database update`
5. `dotnet run`

Tác dụng:

- giảm thao tác tay khi demo
- phù hợp cho việc quay video hoặc trình bày trên lớp

## 8. Danh sách endpoint và chính sách áp dụng

| Method | Endpoint | Mô tả | Rate limit | Auth |
|---|---|---|---|---|
| GET | `/` | Trang thông tin tổng quan | Không | Không |
| GET | `/rate-limited` | Demo fixed window | `fixed` | Không |
| GET | `/sliding-endpoint` | Demo sliding window | `SlidingPolicy` | Không |
| GET | `/anonymous` | Demo quota cho khách | `anonymous` | Không |
| GET | `/authenticated` | Demo quota cho người đã đăng nhập | `authenticated` | Có |
| GET | `/users` | Lấy danh sách user | `fixed` | Không |
| POST | `/users` | Thêm user mới | `fixed` | Không |

## 9. Các policy rate limiting trong bài demo

### 9.1. `fixed`

- 5 request / 10 giây
- queue tối đa 2 request
- xử lý queue theo thứ tự request cũ nhất trước

Dùng cho:

- `/rate-limited`
- `/users`
- `POST /users`

### 9.2. `SlidingPolicy`

- 30 request / 30 giây
- chia 3 segment
- không queue

Dùng cho:

- `/sliding-endpoint`

### 9.3. `anonymous`

- 3 request / 10 giây
- không queue
- partition theo IP/Host hoặc theo user name nếu request đã có auth

Dùng cho:

- `/anonymous`

### 9.4. `authenticated`

- 10 request / 10 giây
- không queue
- partition theo user đã đăng nhập, nếu chưa auth thì dùng key tạm theo client

Dùng cho:

- `/authenticated`

## 10. Cách chạy project

### Cách 1: Chạy bằng PowerShell

```powershell
./run.ps1
```

### Cách 2: Chạy bằng Bash

```bash
chmod +x run.sh
./run.sh
```

### Cách 3: Chạy từng bước thủ công

```bash
dotnet restore
dotnet build
dotnet ef database update
dotnet run
```

Sau khi chạy, mở:

- `https://localhost:7239/swagger`
- hoặc `http://localhost:5239/swagger`

## 11. Cách test từng endpoint

### 11.1. Test `GET /rate-limited`

Gọi endpoint:

```bash
curl http://localhost:5239/rate-limited
```

Nếu gọi lặp lại liên tục trong 10 giây:

- 5 request đầu sẽ được phép
- một vài request có thể vào queue
- các request vượt ngưỡng sẽ nhận `429`

Kết quả lỗi:

```text
Too many requests. Please try again later.
```

### 11.2. Test `GET /sliding-endpoint`

```bash
curl http://localhost:5239/sliding-endpoint
```

Mục đích khi demo:

- giải thích đây là sliding window
- quota không reset "cục bộ" như fixed window

### 11.3. Test `GET /anonymous`

```bash
curl http://localhost:5239/anonymous
```

Sau 3 lần trong 10 giây, request tiếp theo sẽ bị chặn.

### 11.4. Test `GET /authenticated`

Không gửi header:

```bash
curl http://localhost:5239/authenticated
```

Kết quả:

- thông thường sẽ bị từ chối do endpoint bắt buộc authorization

Gửi đúng header:

```bash
curl -H "X-Demo-Auth: true" http://localhost:5239/authenticated
```

Kết quả mong đợi:

```text
Xin chào DemoUser, đây là endpoint dành cho người dùng đã đăng nhập!
```

### 11.5. Test `POST /users`

```bash
curl -X POST http://localhost:5239/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Nguyễn Văn A\"}"
```

Kết quả:

- tạo thêm 1 bản ghi trong bảng `Users`
- trả về `201 Created`

### 11.6. Test `GET /users`

```bash
curl http://localhost:5239/users
```

Kết quả:

- trả về danh sách user đang có trong database

## 12. Kịch bản demo

### Giai đoạn 1: Giới thiệu bài toán

- API nếu không có rate limiting sẽ dễ bị spam
- rate limiting giúp giới hạn số lần gọi trong một khoảng thời gian
- bài này demo 4 policy khác nhau

### Giai đoạn 2: Chạy ứng dụng

Thực hiện:

1. mở terminal tại thư mục project
2. chạy `./run.ps1` hoặc `dotnet run`
3. mở Swagger

- project dùng Minimal API nên tất cả tập trung trong `Program.cs`
- Swagger được bật để test trực quan

### Giai đoạn 3: Demo fixed window

Thực hiện:

1. gọi `GET /rate-limited` vài lần
2. gọi liên tục nhanh để vượt ngưỡng
3. cho người xem thấy `429`

- policy này cho 5 request trong 10 giây
- vượt ngưỡng thì bị chặn
- có queue 2 request để giảm bớt việc từ chối ngay lập tức

### Giai đoạn 4: Demo sliding window

Thực hiện:

1. gọi `GET /sliding-endpoint`
2. giải thích lý thuyết sliding window

- fixed window reset theo cục 10 giây
- sliding window chia nhỏ cửa sổ để tính mềm hơn

### Giai đoạn 5: Demo anonymous và authenticated

Thực hiện:

1. gọi `GET /anonymous` 3 lần, lần thứ 4 để thấy bị chặn
2. gọi `GET /authenticated` không có header để thấy endpoint cần auth
3. gọi lại với header `X-Demo-Auth: true`

- anonymous bị giới hạn chặt hơn
- user đã đăng nhập có quota rộng hơn
- đây là cách hay dùng trong hệ thống thật: ưu tiên user hợp lệ

### Giai đoạn 6: Demo EF Core

Thực hiện:

1. gọi `POST /users` để thêm user
2. gọi `GET /users` để đọc danh sách


- rate limit không chỉ áp dụng cho endpoint đơn giản
- endpoint truy cập database cũng cần giới hạn để bảo vệ tài nguyên

### Giai đoạn 7: Kết luận



- ASP.NET Core hỗ trợ rate limiting sẵn
- có thể tạo nhiều policy cho từng loại endpoint
- có thể kết hợp với auth và EF Core
- đây là nền tảng để mở rộng sang API thực tế

## 13. giải thích source code


- Minimal API phù hợp demo nhỏ vì tập trung logic vào `Program.cs`
- fake auth giúp minh hoạ authorization mà không tăng độ phức tạp JWT
- `AddPolicy(...)` cho phép chia quota theo từng người dùng hoặc IP
- endpoint `/users` chứng minh middleware rate limiter vẫn hoạt động tốt cùng EF Core
- `AsNoTracking()` được dùng cho lệnh đọc để giảm overhead

## 14. Giới hạn của demo hiện tại

Project này là demo học tập, chưa phải production-ready.

Các điểm chưa đầy đủ:

- fake auth không phải JWT thật
- chưa có validation cho `CreateUserRequest`
- chưa có logging riêng cho sự kiện bị rate limit
- chưa tách endpoint ra file/module riêng
- chưa có test tự động

## 15. Hướng mở rộng nếu muốn nâng cấp

Bạn có thể mở rộng demo theo các hướng:

- dùng JWT thật thay cho fake auth
- thêm `PartitionedRateLimiter` phức tạp hơn
- thêm logging và metrics
- thêm endpoint update/delete cho `User`
- thêm validation bằng FluentValidation hoặc endpoint filter
- đưa cấu hình rate limit vào `appsettings.json`

## 16. Tóm tắt nhanh

Nếu cần tóm tắt trong 30 giây:

- Đây là ASP.NET Core Minimal API dùng Rate Limiting để bảo vệ endpoint.
- Có 4 policy: `fixed`, `SlidingPolicy`, `anonymous`, `authenticated`.
- Có fake auth bằng header `X-Demo-Auth: true`.
- Có EF Core + LocalDB để demo endpoint thao tác database.
- Khi vượt ngưỡng, API trả về `429 Too Many Requests`.
