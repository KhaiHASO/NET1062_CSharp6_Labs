using demo02.Models;
using Microsoft.EntityFrameworkCore;

namespace demo02.Data;

/// <summary>
/// DbContext chính của ứng dụng, quản lý các bảng người dùng và bài viết.
/// </summary>
/// <param name="options">Cấu hình DbContext được ASP.NET Core inject.</param>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>
    /// Tập bản ghi người dùng.
    /// </summary>
    public DbSet<User> Users => Set<User>();

    /// <summary>
    /// Tập bản ghi bài viết.
    /// </summary>
    public DbSet<Post> Posts => Set<Post>();
}
