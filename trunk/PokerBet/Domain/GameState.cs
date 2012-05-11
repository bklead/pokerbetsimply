using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("GameStates")]
    public class GameState
    {
        [Key]
        public int Id { get; set; }
        public int Table4PlayerId { get; set; }
        public int Table6PlayerId { get; set; }
        public int Table8PlayerId { get; set; }
        public short State { get; set; }
        public DateTime StartTime { get; set; }

        [ForeignKey("Table4PlayerId")]
        public virtual Game Table4Player { get; set; }

        [ForeignKey("Table6PlayerId")]
        public virtual Game Table6Player { get; set; }

        [ForeignKey("Table8PlayerId")]
        public virtual Game Table8Player { get; set; }
    }
}
