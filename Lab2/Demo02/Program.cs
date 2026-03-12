using Demo02.Data;
using Demo02.Models;
using Demo02.Repositories;
using Demo02.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký Dependency Injection
builder.Services.AddScoped<IBookRepository, SqlBookRepository>();
builder.Services.AddScoped<IBookService, BookService>();

// PHẦN DEMO DI: Thay đổi Implementation dễ dàng mà không phá vỡ BookService
//builder.Services.AddScoped<INotificationService, EmailNotificationService>(); // Yêu cầu ban đầu
builder.Services.AddScoped<INotificationService, TelegramNotificationService>(); // Yêu cầu thay đổi

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/books", async (IBookService bookService) =>
    await bookService.GetAllBooksAsync());

app.MapPost("/books", async (Book book, IBookService bookService) =>
{
    await bookService.AddBookAsync(book);
    return Results.Created($"/books/{book.Id}", book);
});

app.Run();
