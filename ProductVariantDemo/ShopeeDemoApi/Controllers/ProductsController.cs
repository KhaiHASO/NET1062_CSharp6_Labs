using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopeeDemoApi.Data;
using ShopeeDemoApi.Models;
using System.Linq;

namespace ShopeeDemoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Variations)
                    .ThenInclude(v => v.VariationOptions)
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // GET: api/Products/5/skus-flat
        // This reproduces the T-SQL query in the user request
        [HttpGet("{id}/skus-flat")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductSkusFlat(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // We need to query ProductItems and join with Configuration manually or via navigation
            var items = await _context.ProductItems
                .Where(pi => pi.ProductID == id)
                .Include(pi => pi.Product)
                .Include(pi => pi.ProductConfigurations)
                    .ThenInclude(pc => pc.VariationOption)
                        .ThenInclude(vo => vo.Variation)
                .ToListAsync();

            // Perform the aggregation in memory (client evaluation) because String.Join is not easily translated to SQL in basic EF Core LINQ
            // Note: For large datasets, use raw SQL or stored procedure. For demo, this is fine.
            var result = items.Select(pi => new
            {
                ProductName = pi.Product?.Name,
                SKU = pi.SKU,
                Price = pi.Price,
                StockQuantity = pi.StockQuantity,
                VariationName = string.Join(" - ", pi.ProductConfigurations
                    .OrderBy(pc => pc.VariationOption?.Variation?.VariationID) // Order by Variation Group (Color then Size)
                    .ThenBy(pc => pc.VariationOption?.DisplayOrder)            // Then by Option Order (Red then Blue, or M then S)
                    .Select(pc => pc.VariationOption?.Value)),
                VariantImage = pi.ProductConfigurations
                    .Select(pc => pc.VariationOption?.ImageUrl)
                    .Where(img => !string.IsNullOrEmpty(img))
                    .OrderByDescending(img => img) 
                    .FirstOrDefault()
            });

            return Ok(result);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.ProductID }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
