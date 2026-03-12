using Demo02.Models;
using Demo02.Repositories;

namespace Demo02.Services;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;
    private readonly INotificationService _notificationService;

    public BookService(IBookRepository bookRepository, INotificationService notificationService)
    {
        _bookRepository = bookRepository;
        _notificationService = notificationService;
    }

    public async Task AddBookAsync(Book book)
    {
        await _bookRepository.AddBookAsync(book);
        _notificationService.SendNotification($"Đã thêm sách mới: {book.Title}");
    }

    public async Task<IEnumerable<Book>> GetAllBooksAsync()
    {
        return await _bookRepository.GetAllBooksAsync();
    }
}
