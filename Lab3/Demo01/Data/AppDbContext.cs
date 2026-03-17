using Demo01.Models;
using Microsoft.EntityFrameworkCore;

namespace Demo01.Data;

/// <summary>
/// Context của cơ sở dữ liệu cho ứng dụng.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<SinhVien> SinhViens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình bổ sung (nếu cần) thông qua Fluent API
        modelBuilder.Entity<SinhVien>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MSSV).IsRequired().HasMaxLength(10);
            entity.Property(e => e.HoTen).IsRequired().HasMaxLength(100);
        });
    }
}
