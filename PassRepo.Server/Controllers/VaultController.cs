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
public class VaultController : ControllerBase
{
    private readonly AppDbContext _context;

    public VaultController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaultItem>>> GetVaultItems()
    {
        var userId = GetUserId();
        return await _context.VaultItems.Where(v => v.UserId == userId).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<VaultItem>> PostVaultItem(VaultItem vaultItem)
    {
        var userId = GetUserId();
        vaultItem.UserId = userId;
        vaultItem.Id = Guid.NewGuid();

        _context.VaultItems.Add(vaultItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVaultItems), new { id = vaultItem.Id }, vaultItem);
    }
    
    // Helper to get UserId from JWT
    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(idClaim, out var guid))
        {
            return guid;
        }
        throw new UnauthorizedAccessException("Invalid User ID in Token");
    }
}
