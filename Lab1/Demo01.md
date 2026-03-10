# 📖 README: Kịch bản Demo 01 - Trải nghiệm Swagger Petstore UI

## 1. Mục tiêu Demo
- Làm quen với giao diện Swagger UI thông qua một server mẫu (Petstore) đã được cấu hình sẵn.
- Hiểu cách đọc tài liệu API, phân biệt các phương thức (GET, POST, DELETE) và biết cách nạp khóa xác thực.

## 2. Chuẩn bị
- Không cần cài đặt phần mềm hay viết bất kỳ dòng code nào.
- Mở trình duyệt web và truy cập vào đường dẫn: [http://petstore.swagger.io/](http://petstore.swagger.io/).

## 3. Các bước thực hiện (Kịch bản thao tác)

### Bước 1: Khám phá thông tin chung (General Info)
- Khi trang web tải xong, hãy quan sát phần đầu trang, bạn sẽ thấy tên API là **"Swagger Petstore 1.0.5"**.
- Chú ý thông tin đường dẫn gốc (**Base URL**) là `petstore.swagger.io/v2`. Đây là địa chỉ máy chủ thực tế mà các lệnh API sẽ gọi đến.
- Ngay bên dưới tiêu đề có một đường link trỏ tới file mô tả định dạng JSON ([swagger.json](https://petstore.swagger.io/v2/swagger.json)), đây chính là file định nghĩa gốc sinh ra toàn bộ giao diện này.

### Bước 2: Xác thực (Authorization)
- Tài liệu có ghi chú rằng bạn có thể sử dụng API key là `special-key` để kiểm thử các bộ lọc xác thực (authorization filters) của server.
- Hãy tìm nút **"Authorize"** (có biểu tượng hình ổ khóa) trên giao diện, bấm vào đó và nhập từ khóa `special-key` để hệ thống ghi nhận quyền truy cập của bạn.

### Bước 3: Khám phá các phân hệ API (Tags)
- Các API được phân loại gọn gàng thành các nhóm (tags) như:
    - Nhóm **pet**: Everything about your Pets.
    - Nhóm **store**: Access to Petstore orders.
- Nhấn vào từng thanh ngang để mở rộng danh sách các endpoints bên trong.

### Bước 4: Thực hành gọi API (Thao tác với nhóm "store")
Mở rộng nhóm **store**, bạn sẽ thấy danh sách các phương thức đầy màu sắc:
- 🟢 **POST** `/store/order`: Dùng để tạo đơn đặt hàng thú cưng.
- 🔵 **GET** `/store/order/{orderId}`: Dùng để tìm đơn hàng theo ID.
- 🔴 **DELETE** `/store/order/{orderId}`: Dùng để xóa đơn hàng dựa trên ID.
- ⚪ **GET** `/store/inventory`: Trả về trạng thái thống kê kho hàng.

> [!TIP]
> Bạn có thể bấm chọn một API bất kỳ (ví dụ: `GET /store/inventory`), nhấn nút **"Try it out"** trên giao diện thực tế và bấm **"Execute"** để xem kết quả (**Server response**) trả về từ máy chủ.

### Bước 5: Đối chiếu với mã nguồn cấu trúc (Swagger Basic Structure)
Giao diện trực quan bạn vừa bấm thử thực chất được sinh ra từ một file cấu trúc `.yaml`/`.json` với các định nghĩa cơ bản như sau:
- **Khai báo phiên bản**: `swagger: "2.0"`.
- **Máy chủ (Host)**: `"petstore.swagger.io"`.
- **Đường dẫn cơ sở (BasePath)**: `"/v2"`.
- **Phân nhóm (Tags)**: Khai báo rõ các tên nhóm `"pet"`, `"store"`, `"user"`.
