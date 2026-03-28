namespace demo02.Models;

/// <summary>
/// Đại diện cho bài viết được tạo từ endpoint <c>POST /posts</c>.
/// </summary>
public class Post
{
    /// <summary>
    /// Khóa chính của bài viết trong cơ sở dữ liệu.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Tiêu đề bài viết.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Nội dung bài viết do client gửi lên.
    /// Nội dung sẽ được làm sạch bằng <c>HtmlSanitizer</c> trước khi lưu.
    /// </summary>
    public string Content { get; set; } = string.Empty;
}
