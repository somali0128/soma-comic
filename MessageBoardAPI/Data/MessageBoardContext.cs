using Microsoft.EntityFrameworkCore;
using MessageBoardAPI.Models;

namespace MessageBoardAPI.Data
{
    public class MessageBoardContext : DbContext
    {
        public MessageBoardContext(DbContextOptions<MessageBoardContext> options)
            : base(options)
        {
        }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 配置Message实体
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
} 