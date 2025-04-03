using Microsoft.EntityFrameworkCore;

namespace ToDoAPI.Models
{
    public class ItemContext : DbContext
    {
        public DbSet<ItemCategory> itemCategories { get; set; }

        public ItemContext(DbContextOptions<ItemContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
