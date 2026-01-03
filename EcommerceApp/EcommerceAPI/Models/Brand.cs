using System.ComponentModel.DataAnnotations;

namespace EcommerceAPI.Models
{
    public class Brand
    {
        [Key]
        public int BrandId { get; set; }

        [Required(ErrorMessage = "Brand name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public string? Logo { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
