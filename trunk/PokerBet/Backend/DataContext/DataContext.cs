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
        public DbSet<Cards> Forums { get; set; }
        public DbSet<Winnings> Winnings { get; set; }
        public DbSet<Games> Games { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            this.Configuration.ValidateOnSaveEnabled = false;
            base.OnModelCreating(modelBuilder);
        }
    }
}
