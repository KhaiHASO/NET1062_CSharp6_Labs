using System;
using Demo01.Data;
using Demo01.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký DbContext vào Dependency Injection container
// Sử dụng SQL Server với chuỗi kết nối từ appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Thêm hỗ trợ cho Swagger/OpenAPI để dễ dàng kiểm thử
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Cấu hình Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. Định nghĩa các Endpoints (Minimal API)
var sinhVienApi = app.MapGroup("/api/sinhviens");

// [GET] /api/sinhviens: Lấy danh sách tất cả sinh viên
sinhVienApi.MapGet("/", async (AppDbContext db) =>
    await db.SinhViens.ToListAsync());

// [GET] /api/sinhviens/{id}: Lấy thông tin sinh viên theo Id
sinhVienApi.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
    await db.SinhViens.FindAsync(id)
        is SinhVien sv
            ? Results.Ok(sv)
            : Results.NotFound());

// [POST] /api/sinhviens: Thêm mới một sinh viên
sinhVienApi.MapPost("/", async (SinhVien sv, AppDbContext db) =>
{
    // Đảm bảo Id được tạo mới nếu chưa có
    if (sv.Id == Guid.Empty) sv.Id = Guid.NewGuid();
    
    db.SinhViens.Add(sv);
    await db.SaveChangesAsync();

    return Results.Created($"/api/sinhviens/{sv.Id}", sv);
});

// [PUT] /api/sinhviens/{id}: Cập nhật thông tin sinh viên theo Id
sinhVienApi.MapPut("/{id:guid}", async (Guid id, SinhVien inputSv, AppDbContext db) =>
{
    var sv = await db.SinhViens.FindAsync(id);

    if (sv is null) return Results.NotFound();

    // Cập nhật các trường thông tin
    sv.MSSV = inputSv.MSSV;
    sv.HoTen = inputSv.HoTen;
    sv.DiemTrungBinh = inputSv.DiemTrungBinh;
    sv.ChuyenNganh = inputSv.ChuyenNganh;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

// [DELETE] /api/sinhviens/{id}: Xóa sinh viên theo Id
sinhVienApi.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
{
    if (await db.SinhViens.FindAsync(id) is SinhVien sv)
    {
        db.SinhViens.Remove(sv);
        await db.SaveChangesAsync();
        return Results.Ok(sv);
    }

    return Results.NotFound();
});

app.Run();
