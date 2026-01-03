using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceAPI.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int CartId { get; set; }
        [ForeignKey("CartId")]
        public Cart Cart { get; set; }

        public int ProductItemId { get; set; }
        [ForeignKey("ProductItemId")]
        public ProductItem ProductItem { get; set; }

        public int Quantity { get; set; }
    }
}
