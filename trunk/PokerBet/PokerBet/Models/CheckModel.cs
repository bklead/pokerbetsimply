using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PokerBet.Models
{
    public class CheckModel
    {
        public long ContractNumber { get; set; }
        public DateTime CurrentDate { get; set; }
        public GameBet[] games { get; set; }
        public string Margin { get; set; }
        public int ContractSum { get; set; }
    }

    public class GameBet
    {
        public uint Event { get; set; }
        public DateTime StartDate { get; set; }
        public int TableNumber { get; set; }
        public short TableCode { get; set; }
        public int Winner { get; set; }
        public float Index { get; set; }
        public int Sum { get; set; }
        public int CheckId { get; set; }
    }
}

