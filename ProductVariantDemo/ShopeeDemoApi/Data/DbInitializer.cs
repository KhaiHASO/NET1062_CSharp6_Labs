using ShopeeDemoApi.Models;
using System;
using System.Linq;

namespace ShopeeDemoApi.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Look for any products.
            if (context.Products.Any())
            {
                return;   // DB has been seeded
            }

            // 1. Create Product
            var product = new Product
            {
                Name = "Áo Thun Polo Cao Cấp",
                Description = "Chất liệu cotton thoáng mát",
                BasePrice = 150000,
                CreatedAt = DateTime.Now
            };
            context.Products.Add(product);
            context.SaveChanges(); // Save to get ID

            // 2. Create Variations
            var colorVar = new Variation { ProductID = product.ProductID, Name = "Màu sắc" };
            var sizeVar = new Variation { ProductID = product.ProductID, Name = "Kích thước" };
            context.Variations.AddRange(colorVar, sizeVar);
            context.SaveChanges();

            // 3. Create Options
            var redOpt = new VariationOption { VariationID = colorVar.VariationID, Value = "Đỏ", ImageUrl = "img_red.jpg", DisplayOrder = 0 }; // Color Order 0
            var blueOpt = new VariationOption { VariationID = colorVar.VariationID, Value = "Xanh", ImageUrl = "img_blue.jpg", DisplayOrder = 1 }; // Color Order 1
            var sOpt = new VariationOption { VariationID = sizeVar.VariationID, Value = "S", ImageUrl = null, DisplayOrder = 0 }; // Size Order 0
            var mOpt = new VariationOption { VariationID = sizeVar.VariationID, Value = "M", ImageUrl = null, DisplayOrder = 1 }; // Size Order 1
            context.VariationOptions.AddRange(redOpt, blueOpt, sOpt, mOpt);
            context.SaveChanges();

            // 4. Create SKUs (Product Items)
            // SKU 1: Red - S
            var item1 = new ProductItem { ProductID = product.ProductID, SKU = "SKU-RED-S", Price = 100000, StockQuantity = 10 };
            // SKU 2: Red - M
            var item2 = new ProductItem { ProductID = product.ProductID, SKU = "SKU-RED-M", Price = 120000, StockQuantity = 5 };
            // SKU 3: Blue - S
            var item3 = new ProductItem { ProductID = product.ProductID, SKU = "SKU-BLUE-S", Price = 100000, StockQuantity = 20 };
            
            context.ProductItems.AddRange(item1, item2, item3);
            context.SaveChanges();

            // 5. Mapping Configuration
            var configs = new ProductConfiguration[]
            {
                // Item 1: Red + S
                new ProductConfiguration { ProductItemID = item1.ProductItemID, VariationOptionID = redOpt.VariationOptionID },
                new ProductConfiguration { ProductItemID = item1.ProductItemID, VariationOptionID = sOpt.VariationOptionID },

                // Item 2: Red + M
                new ProductConfiguration { ProductItemID = item2.ProductItemID, VariationOptionID = redOpt.VariationOptionID },
                new ProductConfiguration { ProductItemID = item2.ProductItemID, VariationOptionID = mOpt.VariationOptionID },

                // Item 3: Blue + S
                new ProductConfiguration { ProductItemID = item3.ProductItemID, VariationOptionID = blueOpt.VariationOptionID },
                new ProductConfiguration { ProductItemID = item3.ProductItemID, VariationOptionID = sOpt.VariationOptionID },
            };

            context.ProductConfigurations.AddRange(configs);
            context.SaveChanges();
        }
    }
}
