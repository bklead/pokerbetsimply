using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("RiverFinder")]
    public class RiverFinder
    {
        [Key]
        public int Id { get; set; }
        public short NumberOfPlayers { get; set; }
        public double Prize1 { get; set; }
        public double Prize2 { get; set; }
        public double Prize3 { get; set; }
        public double Prize4 { get; set; }
        public double Prize5 { get; set; }
        public double Prize6 { get; set; }
        public double Prize7 { get; set; }
        public double Prize8 { get; set; }
    }
}
