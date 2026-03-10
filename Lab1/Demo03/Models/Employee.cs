using System.ComponentModel.DataAnnotations;

namespace Demo03.Models;

public class Employee
{
    [Key]
    public int Id { get; set; }

    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    [Required(ErrorMessage = "EmailId là bắt buộc")]
    [EmailAddress(ErrorMessage = "EmailId không đúng định dạng")]
    public string EmailId { get; set; } = string.Empty;
}
