using System.ComponentModel.DataAnnotations;

namespace MessageBoardAPI.Models
{
    public class Message
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 