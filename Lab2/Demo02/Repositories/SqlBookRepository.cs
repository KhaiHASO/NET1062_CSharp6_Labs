using Demo02.Data;
using Demo02.Models;
using Microsoft.EntityFrameworkCore;

namespace Demo02.Repositories;

public class SqlBookRepository : IBookRepository
{
    private readonly AppDbContext _context;

    public SqlBookRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddBookAsync(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Book>> GetAllBooksAsync()
    {
        return await _context.Books.ToListAsync();
    }
}
