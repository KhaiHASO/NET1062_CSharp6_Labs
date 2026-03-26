using Microsoft.EntityFrameworkCore;
using SecureResourceApi.Models;

namespace SecureResourceApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Lưu ý: Không cần Seed Data ở đây vì dùng chung DB với Demo 01.
            // Tuy nhiên có thể khai báo Mapping nếu cần.
        }
    }
}
