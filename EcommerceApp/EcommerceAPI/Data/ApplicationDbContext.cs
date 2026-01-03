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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
        }
    }
}
