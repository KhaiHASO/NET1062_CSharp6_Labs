using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopeeDemoApi.Models
{
    public class ProductItem
    {
        [Key]
        public int ProductItemID { get; set; }

        public int ProductID { get; set; }

        [StringLength(50)]
        public string? SKU { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; } = 0;

        // Navigation Properties
        [ForeignKey("ProductID")]
        public Product? Product { get; set; }

        public ICollection<ProductConfiguration> ProductConfigurations { get; set; } = new List<ProductConfiguration>();
    }
}
