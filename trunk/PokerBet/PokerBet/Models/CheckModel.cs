using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PokerBet.Models
{
    public class CheckModel
    {
        public string ContractNumber { get; set; }
        public DateTime CurrentDate { get; set; }
        public GameBet[] Games { get; set; }
        public string Margin { get; set; }
        public int ContractSum { get; set; }
        public string BarCode { get; set; }
    }

    public class GameBet
    {
        public long Event { get; set; }
        public DateTime StartDate { get; set; }
        public int TableNumber { get; set; }
        public int TableCode { get; set; }
        public int Winner { get; set; }
        public double Index { get; set; }
        public int Sum { get; set; }
        public int CheckId { get; set; }
    }
}

