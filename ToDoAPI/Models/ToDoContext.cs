using Microsoft.EntityFrameworkCore;


namespace ToDoAPI.Models
{
    public class ToDoContext : DbContext
    {
        public DbSet<ToDoItem> TodoItems { get; set; }

        public ToDoContext(DbContextOptions<ToDoContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<ToDoItem>()
        //    .HasOne(p => p.Company)
        //    .WithMany(t => t.Users)
        //    .HasForeignKey(p => p.CompanyName)
        //    .HasPrincipalKey(t => t.Name);
        //}
    }
}
