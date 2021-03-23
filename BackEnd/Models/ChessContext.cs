using Microsoft.EntityFrameworkCore;

namespace BackEnd.Models
{

    public class ChessContext : DbContext
    {

        public DbSet<Archive> ChessArchive { get; set; }
        public DbSet<GameInfo> Matches { get; set; }
        public DbSet<ChessPlayer> Players { get; set; }

        public ChessContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<Archive>().HasMany(a => a.Games).WithOne(g => g.GameArchive).OnDelete(DeleteBehavior.Cascade);
            base.OnModelCreating(mb);
        }
    }
}