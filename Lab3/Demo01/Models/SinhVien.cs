using System.ComponentModel.DataAnnotations;

namespace Demo01.Models;

/// <summary>
/// Entity đại diện cho Sinh Viên trong hệ thống.
/// </summary>
public class SinhVien
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(10)]
    public string MSSV { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string HoTen { get; set; } = string.Empty;

    public double DiemTrungBinh { get; set; }

    public string? ChuyenNganh { get; set; }
}
