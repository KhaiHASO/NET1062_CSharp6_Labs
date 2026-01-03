using Microsoft.EntityFrameworkCore;
using EcommerceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcommerceAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.Migrate();

            // 1. Seed Users
            if (!context.Users.Any())
            {
                var users = new User[]
                {
                    new User { Username = "admin", PasswordHash = HashPassword("admin123"), Role = "Admin" },
                    new User { Username = "staff", PasswordHash = HashPassword("staff123"), Role = "Employee" },
                    new User { Username = "user1", PasswordHash = HashPassword("user123"), Role = "Customer" }
                };
                context.Users.AddRange(users);
                context.SaveChanges();
            }

            // 2. Seed Brands & Categories
            if (!context.Brands.Any())
            {
                context.Brands.AddRange(
                    new Brand { Name = "Apple", Logo = "apple_logo.png", Description = "Think Different" },
                    new Brand { Name = "Samsung", Logo = "samsung_logo.png", Description = "Inspire the World" },
                    new Brand { Name = "Sony", Logo = "sony_logo.png", Description = "Be Moved" }
                );
                context.SaveChanges();
            }

            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category { Name = "Phone", Description = "Smartphones" },
                    new Category { Name = "Laptop", Description = "Notebooks & Ultrabooks" },
                    new Category { Name = "Accessories", Description = "Headphones, Chargers" }
                );
                context.SaveChanges();
            }

            // 3. Seed Products (if empty)
            if (context.Products.Any()) return;

            var apple = context.Brands.First(b => b.Name == "Apple");
            var phone = context.Categories.First(c => c.Name == "Phone");

            // Create Product: iPhone 15 Pro Max
            var product = new Product
            {
                Name = "iPhone 15 Pro Max",
                Description = "Disign with Titanium",
                BasePrice = 1200, // $1200 base
                BrandId = apple.BrandId,
                CategoryId = phone.CategoryId,
                CreatedAt = DateTime.Now
            };
            context.Products.Add(product);
            context.SaveChanges(); // Get ID

            // Create Variations
            var colorVar = new Variation { ProductID = product.ProductID, Name = "Màu sắc" };
            var storageVar = new Variation { ProductID = product.ProductID, Name = "Dung lượng" };
            context.Variations.AddRange(colorVar, storageVar);
            context.SaveChanges();

            // Create Options
            var titaniumNatual = new VariationOption { VariationID = colorVar.VariationID, Value = "Titan Tự Nhiên", ImageUrl = "titan_natural.jpg", DisplayOrder = 0 };
            var titaniumBlue = new VariationOption { VariationID = colorVar.VariationID, Value = "Titan Xanh", ImageUrl = "titan_blue.jpg", DisplayOrder = 1 };
            
            var gb256 = new VariationOption { VariationID = storageVar.VariationID, Value = "256GB", DisplayOrder = 0 };
            var gb512 = new VariationOption { VariationID = storageVar.VariationID, Value = "512GB", DisplayOrder = 1 };
            
            context.VariationOptions.AddRange(titaniumNatual, titaniumBlue, gb256, gb512);
            context.SaveChanges();

            // Create SKUs (Product Items)
            // SKU 1: Natural - 256GB
            var item1 = new ProductItem { ProductID = product.ProductID, SKU = "IP15PM-NAT-256", Price = 1200, StockQuantity = 50 };
            // SKU 2: Natural - 512GB
            var item2 = new ProductItem { ProductID = product.ProductID, SKU = "IP15PM-NAT-512", Price = 1400, StockQuantity = 30 };
            // SKU 3: Blue - 256GB
            var item3 = new ProductItem { ProductID = product.ProductID, SKU = "IP15PM-BLU-256", Price = 1200, StockQuantity = 40 };

            context.ProductItems.AddRange(item1, item2, item3);
            context.SaveChanges();

            // Mapping Configuration
            var configs = new List<ProductConfiguration>
            {
                // Item 1: Natural + 256GB
                new ProductConfiguration { ProductItemID = item1.ProductItemID, VariationOptionID = titaniumNatual.VariationOptionID },
                new ProductConfiguration { ProductItemID = item1.ProductItemID, VariationOptionID = gb256.VariationOptionID },

                // Item 2: Natural + 512GB
                new ProductConfiguration { ProductItemID = item2.ProductItemID, VariationOptionID = titaniumNatual.VariationOptionID },
                new ProductConfiguration { ProductItemID = item2.ProductItemID, VariationOptionID = gb512.VariationOptionID },

                // Item 3: Blue + 256GB
                new ProductConfiguration { ProductItemID = item3.ProductItemID, VariationOptionID = titaniumBlue.VariationOptionID },
                new ProductConfiguration { ProductItemID = item3.ProductItemID, VariationOptionID = gb256.VariationOptionID },
            };

            context.ProductConfigurations.AddRange(configs);
            context.SaveChanges();
        }

        private static string HashPassword(string password)
        {
             using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}
