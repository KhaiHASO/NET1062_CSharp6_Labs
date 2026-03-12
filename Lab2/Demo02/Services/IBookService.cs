using Demo02.Models;

namespace Demo02.Services;

public interface IBookService
{
    Task AddBookAsync(Book book);
    Task<IEnumerable<Book>> GetAllBooksAsync();
}
