using Demo01.RateLimiting.Models;
using Microsoft.EntityFrameworkCore;

namespace Demo01.RateLimiting.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Name)
                .HasMaxLength(100)
                .IsRequired();
        });
    }
}
