using Demo01.Data;
using Demo01.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/", () => "Hello, World!");

app.MapGet("/books", async (AppDbContext db) =>
    await db.Books.ToListAsync());

app.MapGet("/books/{id}", async (int id, AppDbContext db) =>
    await db.Books.FindAsync(id)
        is Book book
            ? Results.Ok(book)
            : Results.NotFound());

app.MapPost("/books", async (Book book, AppDbContext db) =>
{
    db.Books.Add(book);
    await db.SaveChangesAsync();
    return Results.Created($"/books/{book.Id}", book);
});

app.MapPut("/books/{id}", async (int id, Book inputBook, AppDbContext db) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null) return Results.NotFound();

    book.Title = inputBook.Title;
    book.Author = inputBook.Author;

    await db.SaveChangesAsync();
    return Results.Ok(book);
});

app.MapDelete("/books/{id}", async (int id, AppDbContext db) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null) return Results.NotFound();

    db.Books.Remove(book);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
