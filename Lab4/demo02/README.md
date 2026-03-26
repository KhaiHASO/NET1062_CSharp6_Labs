# Demo 02: Bảo vệ API bằng JWT Bearer Token

## 1. Giới thiệu
Mục tiêu của Demo 02 là xây dựng một hệ thống Web API có các endpoint được bảo vệ (Secure API Endpoints). Chỉ những yêu cầu (Requests) có chứa mã xác thực **JSON Web Token (JWT)** hợp lệ trong HTTP Header mới có quyền truy cập vào dữ liệu sản phẩm.

## 2. Cấu trúc & Cấu hình
- **Kế thừa Database**: Dự án này sử dụng chung cơ sở dữ liệu `CSharp6Lab4Demo01` từ Demo 01 để truy xuất danh sách sản phẩm đã được seed sẵn.
- **Cấu hình appsettings.json**:
    - Chuỗi kết nối Database phải trỏ đúng về `CSharp6Lab4Demo01`.
    - **Quan trọng**: Các thông số JWT (`Key`, `Issuer`, `Audience`) trong `appsettings.json` phải khớp hoàn toàn với Demo 01. Điều này cho phép Demo 02 có thể giải mã và xác minh tính hợp lệ của Token được sinh ra từ Demo 01.

## 3. Giải thích Code
- **AddAuthentication**: Đăng ký dịch vụ xác thực vào hệ thống, chỉ định lược đồ mặc định là `JwtBearerDefaults.AuthenticationScheme`.
- **AddJwtBearer**: Cấu hình cách thức kiểm tra Token. Hệ thống sẽ kiểm tra xem Token có được ký bằng đúng `Key` bí mật không, và các thông tin `Issuer`, `Audience` có khớp không.
- **TokenValidationParameters**: Định nghĩa các tiêu chuẩn để một Token được coi là hợp lệ (kiểm tra chữ ký, thời gian hết hạn, nhà phát hành...).
- **Attribute [Authorize]**: Được đặt trên `ProductsController`. Nó đóng vai trò như một "người gác cổng", yêu cầu mọi request gọi đến controller này phải được xác thực thành công. Nếu không có Token hoặc Token không hợp lệ, hệ thống sẽ tự động trả về lỗi `401 Unauthorized`.

## 4. Kịch bản kiểm thử (Test Scenarios)

Giả sử ứng dụng đang chạy tại địa chỉ: `https://localhost:7100` (hoặc cổng thực tế khi bạn chạy `dotnet run`).

### Kịch bản 1: Truy cập thất bại (Không có Token)
- **Phương thức**: `GET`
- **URL**: `/api/products`
- **Header**: Không có `Authorization`.
- **Kết quả dự kiến**: HTTP Status `401 Unauthorized`.

### Kịch bản 2: Truy cập thành công (Có kèm JWT Token)
- **Phương thức**: `GET`
- **URL**: `/api/products`
- **Header**:
    - `Authorization`: `Bearer <Token_Lấy_Từ_Demo01>`
- **Hướng dẫn**: 
    1. Chạy Demo 01 để lấy mã Token từ API đăng nhập.
    2. Thay thế `<Token_Lấy_Từ_Demo01>` bằng chuỗi Token thực tế bạn vừa nhận được.
- **Kết quả dự kiến**: HTTP Status `200 OK` và danh sách sản phẩm dạng JSON.

```json
[
  {
    "productId": 1,
    "name": "Laptop Dell XPS",
    "category": "Electronics",
    "color": "Silver",
    "unitPrice": 1500,
    "availableQuantity": 10
  },
  {
    "productId": 2,
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "color": "Titanium",
    "unitPrice": 1200,
    "availableQuantity": 20
  }
]
```
