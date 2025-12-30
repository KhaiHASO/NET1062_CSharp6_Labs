# Product Variant Demo (Shopee Clone)

Dự án này mô phỏng chức năng quản lý phân loại sản phẩm của Shopee, hỗ trợ 2 nhóm phân loại (ví dụ: Màu sắc, Kích thước) và tạo bảng SKU ma trận.

## Cấu trúc Dự án

Dự án bao gồm 2 thành phần chính:

1.  **ShopeeDemoApi** (`ASP.NET Core 9.0 Web API`): Backend xử lý dữ liệu và lưu trữ vào SQL Server.
2.  **ShopeeDemoFe** (`React + Vite + TypeScript`): Frontend giao diện người dùng.

## Yêu cầu

-   .NET 9.0 SDK
-   Node.js (v18 trở lên)
-   SQL Server

## Hướng dẫn Cài đặt & Chạy

### 1. Backend (ShopeeDemoApi)

Di chuyển vào thư mục API và chạy ứng dụng:

```bash
cd ShopeeDemoApi
dotnet run
```

Backend sẽ chạy tại `http://localhost:5056`.
API Swagger có tại: `http://localhost:5056/swagger` (nếu có cấu hình).

### 2. Frontend (ShopeeDemoFe)

Di chuyển vào thư mục Frontend, cài đặt thư viện và chạy:

```bash
cd ShopeeDemoFe
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`.

## Các tính năng đã thực hiện

-   **Backend**: 
    -   API CRUD Sản phẩm và Biến thể.
    -   Cấu hình CORS cho phép Frontend truy cập.
-   **Frontend**:
    -   Quản lý form với `react-hook-form` và `zod`.
    -   Giao diện kéo thả (Drag & Drop) với `@dnd-kit`.
    -   Tích hợp **Redux Toolkit Query (RTK Query)** để gọi API.
    -   Giao diện người dùng (UI) được cải thiện với hiệu ứng đổ bóng, colors gradient.

## Công nghệ sử dụng

-   **BE**: C#, ASP.NET Core, Entity Framework Core.
-   **FE**: React, TypeScript, Tailwind CSS, Shadcn UI, Redux Toolkit.
