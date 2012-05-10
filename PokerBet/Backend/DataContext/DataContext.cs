using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using Domain;

namespace Backend.DataContext
{
    public class PokerBetContext : DbContext
    {
        public DbSet<Card> Cards { get; set; }
        public DbSet<Winning> Winnings { get; set; }
        public DbSet<Game> Games { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            this.Configuration.ValidateOnSaveEnabled = false;
            base.OnModelCreating(modelBuilder);
        }
    }
}
