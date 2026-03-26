using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Demo02;

/// <summary>
/// Xử lý lỗi toàn cục cho ứng dụng sử dụng giao diện IExceptionHandler (.NET 8+).
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Phương thức được gọi khi có ngoại lệ chưa được xử lý xảy ra trong pipeline.
    /// </summary>
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // Ghi log lỗi chi tiết bao gồm Message và StackTrace
        _logger.LogError(exception, "Một lỗi không mong đợi đã xảy ra: {Message}", exception.Message);

        // Tạo đối tượng ProblemDetails theo chuẩn RFC 7807
        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Lỗi hệ thống",
            Detail = "Đã có lỗi xảy ra phía máy chủ. Vui lòng kiểm tra log để biết thêm chi tiết.",
            Instance = httpContext.Request.Path
        };

        // Thiết lập mã trạng thái và trả về JSON cho client
        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        // Trả về true để báo hiệu lỗi đã được xử lý
        return true;
    }
}
