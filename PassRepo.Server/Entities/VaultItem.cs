using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PassRepo.Server.Entities;

public class VaultItem
{
    [Key]
    [Column(TypeName = "char(36)")]
    public Guid Id { get; set; }

    [Column(TypeName = "char(36)")]
    public Guid UserId { get; set; }

    [Column(TypeName = "longtext")]
    public string EncryptedBlob { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Nonce { get; set; } = string.Empty;

    public bool IsFavorite { get; set; }

    public int LogoId { get; set; }
}
