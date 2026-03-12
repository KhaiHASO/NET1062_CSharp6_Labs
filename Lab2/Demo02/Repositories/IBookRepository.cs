using Demo02.Models;

namespace Demo02.Repositories;

public interface IBookRepository
{
    Task AddBookAsync(Book book);
    Task<IEnumerable<Book>> GetAllBooksAsync();
}
