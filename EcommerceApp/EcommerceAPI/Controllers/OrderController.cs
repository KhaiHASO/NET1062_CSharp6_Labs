using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceAPI.Data;
using EcommerceAPI.Models;
using System.Text.Json;

namespace EcommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Order/checkout/{userId}
        [HttpPost("checkout/{userId}")]
        public async Task<ActionResult<Order>> Checkout(int userId)
        {
            // 1. Get Cart with all necessary product details
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.ProductItem)
                        .ThenInclude(pi => pi.Product)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.ProductItem)
                        .ThenInclude(pi => pi.ProductConfigurations)
                            .ThenInclude(pc => pc.VariationOption)
                                .ThenInclude(vo => vo.Variation)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
            {
                return BadRequest("Cart is empty or not found.");
            }

            // 2. Create Order
            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.Now,
                Status = "Pending",
                OrderDetails = new List<OrderDetail>()
            };

            decimal totalAmount = 0;

            // 3. Loop items to create Snapshots
            foreach (var item in cart.CartItems)
            {
                var productItem = item.ProductItem;
                var product = productItem.Product;

                // Construct Options Snapshot JSON: {"Color": "Red", "Size": "XL"}
                var optionsDict = new Dictionary<string, string>();
                if (productItem.ProductConfigurations != null)
                {
                    foreach (var config in productItem.ProductConfigurations)
                    {
                        var groupName = config.VariationOption.Variation.Name; // e.g., "Color"
                        var optionValue = config.VariationOption.Value;       // e.g., "Red"
                        if(!optionsDict.ContainsKey(groupName))
                        {
                            optionsDict.Add(groupName, optionValue);
                        }
                    }
                }
                string snapshotOptionsJson = JsonSerializer.Serialize(optionsDict);

                var orderDetail = new OrderDetail
                {
                    ProductItemId = item.ProductItemId,
                    Quantity = item.Quantity,
                    
                    // --- SNAPSHOT DATA ---
                    SnapshotProductName = product.Name,
                    SnapshotSKU = productItem.SKU,
                    SnapshotPrice = productItem.Price,
                    SnapshotOptions = snapshotOptionsJson
                };

                order.OrderDetails.Add(orderDetail);
                totalAmount += (productItem.Price * item.Quantity);
            }

            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);

            // 4. Clear Cart
            _context.CartItems.RemoveRange(cart.CartItems);
            // Optionally remove the cart itself, or keep it empty. Here we keep empty cart.

            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // GET: api/Order/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }
}
