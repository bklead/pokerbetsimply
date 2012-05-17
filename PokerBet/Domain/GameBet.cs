using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("GameBet")]
    public class GameBet
    {
        public int Id { get; set; }
        public long ContractNumber { get; set; }

        public long Event { get; set; }
        public DateTime StartDate { get; set; }
        public int TableNumber { get; set; }
        public int TableCode { get; set; }
        public int Winner { get; set; }
        public double Index { get; set; }
        public int Sum { get; set; }
    }
}
