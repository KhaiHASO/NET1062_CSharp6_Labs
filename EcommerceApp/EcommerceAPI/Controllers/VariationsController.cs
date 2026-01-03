using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceAPI.Data;
using EcommerceAPI.Models;

namespace EcommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VariationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VariationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Variations/options/reorder
        // Body: [202, 201] (IDs in new order)
        [HttpPost("options/reorder")]
        public async Task<IActionResult> ReorderOptions([FromBody] List<int> orderedIds)
        {
            if (orderedIds == null || !orderedIds.Any())
            {
                return BadRequest("List of IDs is required.");
            }

            // Fetch the options present in the list
            var options = await _context.VariationOptions
                .Where(vo => orderedIds.Contains(vo.VariationOptionID))
                .ToListAsync();

            if (options.Count != orderedIds.Count)
            {
                // In exact scenarios, we might want to ensure all IDs exist. 
                // For this demo, we'll proceed with updating the ones found.
            }

            // Update DisplayOrder
            // Index in orderedIds becomes the DisplayOrder
            foreach (var opt in options)
            {
                var index = orderedIds.IndexOf(opt.VariationOptionID);
                if (index != -1)
                {
                    opt.DisplayOrder = index;
                    _context.Entry(opt).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reorder successful", updatedCount = options.Count });
        }
    }
}
