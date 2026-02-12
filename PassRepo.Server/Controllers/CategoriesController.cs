using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PassRepo.Server.Data;
using PassRepo.Server.Entities;
using System.Security.Claims;

namespace PassRepo.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // BU SATIRI EKLE: Veri Transfer Objesi (DTO)
    public record CreateCategoryDto(string Name, string IconName, string Color);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var userId = GetUserId();
        return await _context.Categories.Where(c => c.UserId == userId).ToListAsync();
    }

    [HttpPost]
    // GÜNCELLEME: Parametre olarak Category yerine CreateCategoryDto alıyoruz
    public async Task<ActionResult<Category>> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        var userId = GetUserId();

        var category = new Category
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            IconName = dto.IconName,
            Color = dto.Color
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var userId = GetUserId();
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null) return NotFound();

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(idClaim!);
    }
}