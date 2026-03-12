using Demo01.Models;
using Microsoft.EntityFrameworkCore;

namespace Demo01.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Book> Books => Set<Book>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "Vô Thường", Author = "Thepv" },
            new Book { Id = 2, Title = "1984", Author = "George Orwell" }
        );
    }
}
