using Microsoft.EntityFrameworkCore;
using EcommerceAPI.Models;

namespace EcommerceAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Variation> Variations { get; set; }
        public DbSet<VariationOption> VariationOptions { get; set; }
        public DbSet<ProductItem> ProductItems { get; set; }
        public DbSet<ProductConfiguration> ProductConfigurations { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 0. User Relations
            // User 1 - 1 Cart (Cascade)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Cart)
                .WithOne(c => c.User)
                .HasForeignKey<Cart>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User 1 - n Orders (Restrict)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // 1. Product Relations (Brand/Category) - 1-n Restrict
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // 2. Variations -> Product (Cascade Delete)
            modelBuilder.Entity<Variation>()
                .HasOne(v => v.Product)
                .WithMany(p => p.Variations)
                .HasForeignKey(v => v.ProductID)
                .OnDelete(DeleteBehavior.Cascade);

            // 3. VariationOptions -> Variation (Cascade Delete)
            modelBuilder.Entity<VariationOption>()
                .HasOne(vo => vo.Variation)
                .WithMany(v => v.VariationOptions)
                .HasForeignKey(vo => vo.VariationID)
                .OnDelete(DeleteBehavior.Cascade);

            // 4. ProductItems -> Product (No Action Delete)
            modelBuilder.Entity<ProductItem>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.ProductItems)
                .HasForeignKey(pi => pi.ProductID)
                .OnDelete(DeleteBehavior.NoAction);

            // 5. ProductConfiguration (Composite Key)
            modelBuilder.Entity<ProductConfiguration>()
                .HasKey(pc => new { pc.ProductItemID, pc.VariationOptionID });

            // ProductConfiguration -> ProductItem (Cascade Delete)
            modelBuilder.Entity<ProductConfiguration>()
                .HasOne(pc => pc.ProductItem)
                .WithMany(pi => pi.ProductConfigurations)
                .HasForeignKey(pc => pc.ProductItemID)
                .OnDelete(DeleteBehavior.Cascade);

            // ProductConfiguration -> VariationOption (No Action Delete)
            modelBuilder.Entity<ProductConfiguration>()
                .HasOne(pc => pc.VariationOption)
                .WithMany(vo => vo.ProductConfigurations)
                .HasForeignKey(pc => pc.VariationOptionID)
                .OnDelete(DeleteBehavior.NoAction);

            // 6. Cart -> CartItem (Cascade Delete)
            modelBuilder.Entity<Cart>()
                .HasMany(c => c.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // 7. Order -> OrderDetail (Cascade Delete)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderDetails)
                .WithOne(od => od.Order)
                .HasForeignKey(od => od.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
