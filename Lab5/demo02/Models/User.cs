namespace demo02.Models;

/// <summary>
/// Đại diện cho người dùng được tạo từ endpoint <c>POST /users</c>.
/// </summary>
public class User
{
    /// <summary>
    /// Khóa chính của người dùng trong cơ sở dữ liệu.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Tên đăng nhập của người dùng.
    /// Bắt buộc, độ dài từ 3 đến 20 ký tự.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Địa chỉ email của người dùng.
    /// Bắt buộc và phải đúng định dạng email hợp lệ.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Tuổi của người dùng.
    /// Chỉ chấp nhận giá trị từ 18 đến 99.
    /// </summary>
    public int Age { get; set; }
}
