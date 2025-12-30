using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopeeDemoApi.Models
{
    public class Variation
    {
        [Key]
        public int VariationID { get; set; }

        public int ProductID { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        // Navigation Properties
        [ForeignKey("ProductID")]
        public Product? Product { get; set; }

        public ICollection<VariationOption> VariationOptions { get; set; } = new List<VariationOption>();
    }
}
