using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureResourceApi.Data;

namespace SecureResourceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Đảm bảo toàn bộ Controller được bảo vệ bởi JWT
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // Endpoint GET: /api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }
    }
}
