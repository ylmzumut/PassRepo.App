using System;
using System.ComponentModel.DataAnnotations;

namespace PassRepo.Server.Entities;

public class Category
{
	public Guid Id { get; set; }
	public Guid UserId { get; set; } // Hangi kullanýcýnýn kategorisi
	[MaxLength(50)]
	public string Name { get; set; } = string.Empty;
	[MaxLength(50)]
	public string IconName { get; set; } = "Folder"; // 'Wallet', 'Key' vs.
	[MaxLength(20)]
	public string Color { get; set; } = "bg-blue-600"; // Tailwind class
}