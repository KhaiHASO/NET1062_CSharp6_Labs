using Demo02;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH SERILOG
// Thiết lập Serilog để ghi log ra Console và File (rolling interval theo ngày)
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

// Xóa bỏ các logging provider mặc định và sử dụng Serilog
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddOpenApi();

// 2. ĐĂNG KÝ GLOBAL EXCEPTION HANDLER
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(); // Hỗ trợ định dạng ProblemDetails tốt hơn

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 3. SỬ DỤNG EXCEPTION HANDLER MIDDLEWARE
// Middleware này sẽ bắt các exception và chuyển hướng đến GlobalExceptionHandler
app.UseExceptionHandler();

// 4. TRIỂN KHAI CÁC ENDPOINT TEST
app.MapGet("/api/test-log", (ILogger<Program> logger) =>
{
    logger.LogInformation("Đây là log mức độ Information");
    logger.LogWarning("Đây là log mức độ Warning");
    logger.LogError("Đây là log mức độ Error");

    return Results.Ok(new { message = "Ghi log thành công! Hãy kiểm tra console hoặc thư mục Logs." });
})
.WithName("TestLog");

app.MapGet("/api/test-error", () =>
{
    // Cố tình ném lỗi để test Global Exception Handler
    throw new Exception("Đây là một lỗi hệ thống mô phỏng để test Global Exception Handler!");
})
.WithName("TestError");

try
{
    Log.Information("Ứng dụng đang khởi chạy...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Ứng dụng bị dừng đột ngột!");
}
finally
{
    Log.CloseAndFlush();
}
