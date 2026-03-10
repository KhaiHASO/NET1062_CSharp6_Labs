# 📖 README: Kịch bản Demo 02 - Tìm hiểu cấu trúc cơ bản của Swagger (SWAGGER BASIC STRUCTURE)

## 1. Mục tiêu bài giảng
- Giúp  hiểu rõ cấu trúc của một file định dạng OpenAPI/Swagger (YAML/JSON).
- Phân tích các thành phần cốt lõi: Thông tin cơ bản (**Info**), Đường dẫn (**Paths**), Tham số (**Parameters**), và Mô hình dữ liệu (**Models**).
- Trực quan hóa việc mã code YAML chuyển đổi thành giao diện UI theo thời gian thực.

## 2. Công cụ chuẩn bị
- **Trình duyệt web**: Mở sẵn công cụ Swagger Editor tại địa chỉ [https://editor.swagger.io/](https://editor.swagger.io/).
- **Màn hình chiếu**: Đảm bảo  có thể nhìn rõ giao diện chia đôi của Swagger Editor (bên trái là code, bên phải là giao diện UI render ra).

## 3. Các bước tiến hành Live Demo trên lớp

### Bước 1: Khai báo thông tin chung (Base URL & Info)
- **Thao tác**: Xóa trắng trình soạn thảo bên trái của Swagger Editor để bắt đầu từ đầu.
- **Giải thích**: Bắt đầu bằng việc khai báo phiên bản Swagger và các thông tin chung của API như tên, phiên bản, host, và base path.

**Source code mẫu:**
```yaml
swagger: "2.0"
info:
  version: "1.0.0"
  title: "Demo User API"
  description: "API quản lý người dùng mẫu cho môn học"
host: "api.fpt.edu.vn"
basePath: "/v1"
schemes:
  - "https"
  - "http"
```

> [!NOTE]
> Chỉ cho thấy ngay khi gõ xong, nửa màn hình bên phải đã xuất hiện tiêu đề **"Demo User API"** và thông tin Base URL là `api.fpt.edu.vn/v1`.

### Bước 2: Định nghĩa các đường dẫn (Paths) và Phương thức (Methods)
- **Thao tác**: Thêm khối `paths` để định nghĩa endpoint đầu tiên là lấy danh sách người dùng (`/users`) bằng phương thức GET.

**Source code bổ sung:**
```yaml
paths:
  /users:
    get:
      summary: "Trả về danh sách người dùng"
      produces:
        - "application/json"
      responses:
        200:
          description: "Thành công (OK)"
```

> [!TIP]
> Giao diện UI ngay lập tức hiện ra một thanh màu xanh dương tượng trưng cho phương thức **GET** của `/users`.

### Bước 3: Thêm Tham số (Parameters) vào đường dẫn
- **Thao tác**: Tiếp tục định nghĩa việc lấy chi tiết một người dùng cụ thể bằng cách truyền `userId` vào đường dẫn.

**Source code bổ sung:**
```yaml
  /users/{userId}:
    get:
      summary: "Tìm người dùng theo ID"
      parameters:
        - in: "path"
          name: "userId"
          required: true
          type: "integer"
          description: "ID của người dùng cần tìm"
      responses:
        200:
          description: "Thành công"
```

> [!IMPORTANT]
> Mở rộng thanh **GET /users/{userId}** trên UI,  sẽ thấy tham số `userId` được yêu cầu (`required: true`) và có kiểu dữ liệu là `integer`.

### Bước 4: Sử dụng Input và Output Models (Schema / $ref)
- **Thao tác**: Thay vì viết lại cấu trúc dữ liệu trả về ở nhiều nơi, hướng dẫn  cách định nghĩa một Model chung và tham chiếu đến nó bằng `$ref`.

**Source code bổ sung (thêm vào cuối file):**
```yaml
definitions:
  User:
    type: "object"
    properties:
      id:
        type: "integer"
      hoTen:
        type: "string"
```

**Cập nhật lại phần responses của `/users/{userId}`:**
```yaml
      responses:
        200:
          description: "Thành công"
          schema:
            $ref: '#/definitions/User'
```

> [!NOTE]
> xem phần **"Models"** xuất hiện ở dưới cùng của giao diện UI. Khi click vào endpoint `GET /users/{userId}`, cấu trúc JSON mẫu của `User` sẽ được hiển thị rõ ràng.

---

Việc bóc tách từng khối lệnh YAML như thế này sẽ giúp các bạn  nắm chắc cú pháp khai báo nền tảng. Khi chuyển sang Demo 03, việc cấu hình trong file `Startup.cs` hoặc `Program.cs` sẽ trở nên vô cùng trực quan vì các em đã hiểu bản chất các thiết lập này sinh ra để làm gì.
