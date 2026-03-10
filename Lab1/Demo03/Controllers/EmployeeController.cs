using Demo03.Data;
using Demo03.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Demo03.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmployeeController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lấy danh sách toàn bộ nhân viên.
    /// </summary>
    /// <returns>Danh sách nhân viên</returns>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var employees = await _context.Employees.ToListAsync();
        return Ok(employees);
    }

    /// <summary>
    /// Tạo mới một nhân viên.
    /// </summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/Employee
    ///     {
    ///        "firstName": "Khải",
    ///        "lastName": "Phan Hoàng",
    ///        "emailId": "khaikhai331@gmail.com"
    ///     }
    /// </remarks>
    /// <param name="employee">Dữ liệu nhân viên cần tạo</param>
    /// <response code="201">Trả về thông tin nhân viên vừa được tạo thành công</response>
    /// <response code="400">Nếu dữ liệu gửi lên bị lỗi hoặc thiếu trường hợp lệ</response>
    [HttpPost]
    [ProducesResponseType(typeof(Employee), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody] Employee employee)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        
        // Trả về HTTP 201 cùng với ID của record vừa tạo
        return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
    }
}
