using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopeeDemoApi.Models
{
    public class ProductConfiguration
    {
        public int ProductItemID { get; set; }
        public int VariationOptionID { get; set; }

        // Navigation Properties
        [ForeignKey("ProductItemID")]
        public ProductItem? ProductItem { get; set; }

        [ForeignKey("VariationOptionID")]
        public VariationOption? VariationOption { get; set; }
    }
}
