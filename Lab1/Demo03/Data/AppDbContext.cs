using Demo03.Models;
using Microsoft.EntityFrameworkCore;

namespace Demo03.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed data mẫu
        modelBuilder.Entity<Employee>().HasData(
            new Employee 
            { 
                Id = 1, 
                FirstName = "Khải", 
                LastName = "Phan Hoàng", 
                EmailId = "khaikhai331@gmail.com" 
            },
            new Employee 
            { 
                Id = 2, 
                FirstName = "Admin", 
                LastName = "System", 
                EmailId = "admin@example.com" 
            }
        );
    }
}
