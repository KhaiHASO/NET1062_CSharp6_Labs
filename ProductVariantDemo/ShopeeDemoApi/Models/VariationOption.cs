using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopeeDemoApi.Models
{
    public class VariationOption
    {
        [Key]
        public int VariationOptionID { get; set; }

        public int VariationID { get; set; }

        [Required]
        [StringLength(50)]
        public string Value { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; } = 0; // New column for ordering

        // Navigation Properties
        [ForeignKey("VariationID")]
        public Variation? Variation { get; set; }

        public ICollection<ProductConfiguration> ProductConfigurations { get; set; } = new List<ProductConfiguration>();
    }
}
