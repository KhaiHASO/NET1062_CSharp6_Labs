-- 1. TẠO DATABASE (Nếu chưa có)
CREATE DATABASE ShopeeDemo;
GO
USE ShopeeDemo;
GO

-- =============================================
-- PHẦN 1: TẠO CẤU TRÚC BẢNG (SCHEMA)
-- =============================================

-- 1. Bảng sản phẩm gốc
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,            -- Tên sản phẩm (NVARCHAR hỗ trợ tiếng Việt)
    Description NVARCHAR(MAX),              -- Mô tả
    BasePrice DECIMAL(18, 2),               -- Giá tham khảo
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 2. Bảng định nghĩa nhóm phân loại (VD: Màu sắc, Kích thước)
CREATE TABLE Variations (
    VariationID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    Name NVARCHAR(50) NOT NULL,             -- Tên nhóm (VD: "Màu sắc")
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);
GO

-- 3. Bảng các tùy chọn con (VD: Đỏ, Xanh, S, M)
-- LƯU Ý: ImageUrl nằm ở đây để khớp với logic Shopee (chọn Màu là đổi ảnh)
CREATE TABLE VariationOptions (
    VariationOptionID INT IDENTITY(1,1) PRIMARY KEY,
    VariationID INT NOT NULL,
    Value NVARCHAR(50) NOT NULL,            -- Giá trị (VD: "Đỏ")
    ImageUrl VARCHAR(500) NULL,             -- Ảnh đại diện cho tùy chọn này
    FOREIGN KEY (VariationID) REFERENCES Variations(VariationID) ON DELETE CASCADE
);
GO

-- 4. Bảng SKU (Product Items) - Đây là biến thể thực tế để bán
-- Chứa Giá bán và Tồn kho cụ thể cho từng tổ hợp
CREATE TABLE ProductItems (
    ProductItemID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    SKU VARCHAR(50),                        -- Mã quản lý kho (VD: AO-DO-S)
    Price DECIMAL(18, 2) NOT NULL,          -- Giá bán thực tế
    StockQuantity INT DEFAULT 0,            -- Tồn kho
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE NO ACTION
    -- Lưu ý: ON DELETE NO ACTION để tránh lỗi cycle, hoặc bạn có thể xử lý xóa bằng Trigger
);
GO

-- 5. Bảng cấu hình (Mapping) - Định nghĩa Item này được tạo từ Option nào
-- Ví dụ: Item 1 = (Màu Đỏ) + (Size S)
CREATE TABLE ProductConfiguration (
    ProductItemID INT NOT NULL,
    VariationOptionID INT NOT NULL,
    PRIMARY KEY (ProductItemID, VariationOptionID),
    FOREIGN KEY (ProductItemID) REFERENCES ProductItems(ProductItemID) ON DELETE CASCADE,
    FOREIGN KEY (VariationOptionID) REFERENCES VariationOptions(VariationOptionID) ON DELETE NO ACTION
);
GO

-- =============================================
-- PHẦN 2: THÊM DỮ LIỆU MẪU (SEED DATA)
-- =============================================

-- B1. Tạo sản phẩm "Áo Thun Polo"
INSERT INTO Products (Name, Description, BasePrice)
VALUES (N'Áo Thun Polo Cao Cấp', N'Chất liệu cotton thoáng mát', 150000);

DECLARE @NewProductID INT = SCOPE_IDENTITY(); -- Lấy ID sản phẩm vừa tạo (VD: 1)

-- B2. Tạo 2 nhóm phân loại: "Màu sắc" và "Kích thước"
INSERT INTO Variations (ProductID, Name) VALUES (@NewProductID, N'Màu sắc');
DECLARE @VarColorID INT = SCOPE_IDENTITY();

INSERT INTO Variations (ProductID, Name) VALUES (@NewProductID, N'Kích thước');
DECLARE @VarSizeID INT = SCOPE_IDENTITY();

-- B3. Tạo các tùy chọn (Options)
-- Màu sắc (Có kèm ảnh)
INSERT INTO VariationOptions (VariationID, Value, ImageUrl) VALUES (@VarColorID, N'Đỏ', 'img_red.jpg');
DECLARE @OptRedID INT = SCOPE_IDENTITY();

INSERT INTO VariationOptions (VariationID, Value, ImageUrl) VALUES (@VarColorID, N'Xanh', 'img_blue.jpg');
DECLARE @OptBlueID INT = SCOPE_IDENTITY();

-- Kích thước (Không cần ảnh)
INSERT INTO VariationOptions (VariationID, Value, ImageUrl) VALUES (@VarSizeID, N'S', NULL);
DECLARE @OptSizeSID INT = SCOPE_IDENTITY();

INSERT INTO VariationOptions (VariationID, Value, ImageUrl) VALUES (@VarSizeID, N'M', NULL);
DECLARE @OptSizeMID INT = SCOPE_IDENTITY();

-- B4. Tạo SKU (Sự kết hợp) và Mapping vào bảng Configuration

-- >> SKU 1: Áo Đỏ - Size S (Giá 100k, Tồn 10)
INSERT INTO ProductItems (ProductID, SKU, Price, StockQuantity) VALUES (@NewProductID, 'SKU-RED-S', 100000, 10);
DECLARE @Item1 INT = SCOPE_IDENTITY();
-- Mapping
INSERT INTO ProductConfiguration (ProductItemID, VariationOptionID) VALUES (@Item1, @OptRedID); -- Đỏ
INSERT INTO ProductConfiguration (ProductItemID, VariationOptionID) VALUES (@Item1, @OptSizeSID); -- S

-- >> SKU 2: Áo Đỏ - Size M (Giá 120k, Tồn 5)
INSERT INTO ProductItems (ProductID, SKU, Price, StockQuantity) VALUES (@NewProductID, 'SKU-RED-M', 120000, 5);
DECLARE @Item2 INT = SCOPE_IDENTITY();
-- Mapping
INSERT INTO ProductConfiguration (ProductItemID, VariationOptionID) VALUES (@Item2, @OptRedID); -- Đỏ
INSERT INTO ProductConfiguration (ProductItemID, VariationOptionID) VALUES (@Item2, @OptSizeMID); -- M

-- >> SKU 3: Áo Xanh - Size S (Giá 100k, Tồn 20)
INSERT INTO ProductItems (ProductID, SKU, Price, StockQuantity) VALUES (@NewProductID, 'SKU-BLUE-S', 100000, 20);
DECLARE @Item3 INT = SCOPE_IDENTITY();
-- Mapping
INSERT INTO ProductConfiguration (ProductItemID, VariationOptionID) VALUES (@Item3, @OptBlueID); -- Xanh
INSERT INTO ProductConfiguration (ProductItemID, VariationOptionID) VALUES (@Item3, @OptSizeSID); -- S

-- =============================================
-- PHẦN 3: TRUY VẤN DỮ LIỆU (SELECT)
-- =============================================

-- Query hiển thị danh sách SKU kèm tên phân loại (Giống Shopee)
-- Yêu cầu: SQL Server 2017 trở lên (để dùng hàm STRING_AGG)

SELECT 
    P.Name AS ProductName,
    PI.SKU,
    PI.Price,
    PI.StockQuantity,
    -- Gom nhóm tên biến thể thành chuỗi (VD: "Đỏ, S")
    STRING_AGG(VO.Value, ' - ') WITHIN GROUP (ORDER BY V.VariationID) AS VariationName,
    -- Lấy ảnh của biến thể (Ưu tiên lấy ảnh có dữ liệu)
    MAX(VO.ImageUrl) AS VariantImage
FROM ProductItems PI
JOIN Products P ON PI.ProductID = P.ProductID
JOIN ProductConfiguration PC ON PI.ProductItemID = PC.ProductItemID
JOIN VariationOptions VO ON PC.VariationOptionID = VO.VariationOptionID
JOIN Variations V ON VO.VariationID = V.VariationID
GROUP BY 
    P.Name, PI.SKU, PI.Price, PI.StockQuantity;