using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceAPI.Models
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        public int ProductItemId { get; set; }
        [ForeignKey("ProductItemId")]
        public ProductItem ProductItem { get; set; } // Reference for stock tracking

        public int Quantity { get; set; }

        // --- SNAPSHOT FIELDS ---
        [StringLength(255)]
        public string SnapshotProductName { get; set; }

        [StringLength(100)]
        public string SnapshotSKU { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal SnapshotPrice { get; set; }

        /// <summary>
        /// Stores JSON string of options, e.g., {"Color": "Red", "Size": "XL"}
        /// </summary>
        public string? SnapshotOptions { get; set; }
    }
}
