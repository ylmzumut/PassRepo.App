using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PassRepo.Server.Entities;

public class User
{
    [Key]
    [Column(TypeName = "char(36)")]
    public Guid Id { get; set; }

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string AuthKeyHash { get; set; } = string.Empty;

    [Required]
    public string Salt { get; set; } = string.Empty;
}
