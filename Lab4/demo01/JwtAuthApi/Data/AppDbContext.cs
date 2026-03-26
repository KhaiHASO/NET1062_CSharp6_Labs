using JwtAuthApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace JwtAuthApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<UserInfo> UserInfos { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed UserInfo
            modelBuilder.Entity<UserInfo>().HasData(new UserInfo
            {
                UserId = 1,
                FirstName = "The",
                LastName = "PV",
                UserName = "thepv",
                Email = "Thepv@fpoly.fpt",
                Password = "1234",
                CreatedDate = new DateTime(2026, 3, 19)
            });

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    ProductId = 1,
                    Name = "Laptop Dell XPS",
                    Category = "Electronics",
                    Color = "Silver",
                    UnitPrice = 1500,
                    AvailableQuantity = 10
                },
                new Product
                {
                    ProductId = 2,
                    Name = "iPhone 15 Pro",
                    Category = "Electronics",
                    Color = "Titanium",
                    UnitPrice = 1200,
                    AvailableQuantity = 20
                }
            );
        }
    }
}
